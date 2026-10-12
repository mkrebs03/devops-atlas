---
title: Práctica · de VPS vacía a HTTPS
description: Recorre el camino completo en una máquina real, desde la primera conexión hasta un certificado válido.
type: practice
level: beginner
module: server
tools: [ssh, ufw, systemd, nginx, certbot]
prerequisites: [server.processes, server.proxy-tls]
learningObjectives:
  - Dejar una VPS recién creada con acceso por clave y cortafuegos cerrado.
  - Publicar una aplicación como servicio de systemd que sobreviva a un reinicio.
  - Poner un proxy inverso delante con un certificado emitido y renovable.
takeaways:
  - Cada paso deja una señal comprobable antes de pasar al siguiente.
  - Un reinicio de la máquina es la prueba de que el servicio pertenece al sistema.
  - Todo lo que hiciste a mano aquí es lo que después vas a querer automatizar.
---

## Qué vas a tener al final

`miapp` respondiendo en `https://tu-dominio.com` desde una VPS: arrancada por systemd, alcanzable solo a través de nginx, con el certificado emitido y su renovación programada.

## Requisitos

- Una VPS con Ubuntu 24.04 o Debian 12 recién creada, y su IP pública. Cuesta dinero mientras exista: la última sección dice cómo borrarla.
- Un dominio cuyo registro DNS `A` ya apunte a esa IP. **Comprueba esto antes de empezar** con `dig +short tu-dominio.com`: sin DNS resuelto, el paso del certificado no puede funcionar.
- El repositorio `miapp` en GitHub, de la [práctica de ramas](/collaboration/lab-git-branching/). Si no lo tienes, en el paso 3 puedes crear el archivo a mano.
- Una terminal con `ssh` y `ssh-keygen`.
- Unos 45 minutos.

Los comandos usan `marta`, `TU_IP`, `TU_USUARIO` y `tu-dominio.com`; sustitúyelos por los tuyos.

## Paso 1 · Entrar y crear tu usuario

```bash
ssh-keygen -t ed25519 -C "practica-atlas"     # en tu máquina, si aún no tienes clave
ssh-copy-id root@TU_IP
ssh root@TU_IP
```

Ya dentro:

```bash
adduser marta
usermod -aG sudo marta
mkdir -p /home/marta/.ssh
cp ~/.ssh/authorized_keys /home/marta/.ssh/
chown -R marta:marta /home/marta/.ssh
chmod 700 /home/marta/.ssh
```

**Señal:** desde una segunda terminal, `ssh marta@TU_IP` entra sin pedir contraseña. No cierres la sesión de `root` hasta comprobarlo, y haz el resto de la práctica como `marta`.

## Paso 2 · Cerrar accesos y puertos

```bash
printf 'PermitRootLogin no\nPasswordAuthentication no\n' \
  | sudo tee /etc/ssh/sshd_config.d/00-atlas.conf
sudo sshd -t && sudo systemctl restart ssh
sudo sshd -T | grep -Ei '^(permitrootlogin|passwordauthentication)'
```

El archivo va en `sshd_config.d` y empieza por `00` porque `sshd` se queda con el primer valor que lee de cada opción. Muchas imágenes de nube traen ahí un archivo propio que vuelve a activar las contraseñas; uno que se lea antes gana.

**Señal:** la última orden imprime `permitrootlogin no` y `passwordauthentication no`. Es la configuración que `sshd` aplica de verdad, no la que crees haber escrito.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Señal:** `sudo ufw status verbose` muestra `deny (incoming)` y solo tres reglas permitidas. Vuelve a entrar desde otra terminal para confirmar que sigues teniendo acceso.

## Paso 3 · Traer la aplicación

```bash
sudo apt update && sudo apt install -y nodejs git
sudo mkdir -p /srv/miapp && sudo chown marta:marta /srv/miapp
git clone https://github.com/TU_USUARIO/miapp.git /srv/miapp
```

Si tu repositorio es privado o no lo tienes, crea `/srv/miapp/server.js` con el contenido de [La aplicación de ejemplo](/sample-app/#el-archivo).

La configuración va en un archivo aparte, fuera del repositorio:

```bash
printf 'PORT=8080\nAPP_VERSION=manual-1\n' | sudo tee /etc/miapp.env > /dev/null
sudo chmod 600 /etc/miapp.env
```

No hay ninguna variable `HOST`, así que la aplicación escucha en `127.0.0.1`: no es alcanzable desde fuera, solo a través del proxy.

**Señal:** `node /srv/miapp/server.js` arranca y, desde otra sesión SSH, `curl -s localhost:8080/health` devuelve `{"status":"ok"}`. Detén el proceso con `Ctrl+C`.

## Paso 4 · Convertirla en servicio

```bash
sudo tee /etc/systemd/system/miapp.service > /dev/null <<'EOF'
[Unit]
Description=miapp
After=network-online.target

[Service]
Type=simple
User=marta
WorkingDirectory=/srv/miapp
EnvironmentFile=/etc/miapp.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now miapp
systemctl status miapp
```

**Señal:** el estado dice `active (running)`, y `curl -s localhost:8080/` responde `miapp manual-1`: el servicio leyó el archivo de entorno.

Ahora la prueba que de verdad distingue un servicio de un proceso tuyo:

```bash
sudo reboot
# espera un minuto, vuelve a entrar
curl -s localhost:8080/health
```

**Señal:** responde tras el reinicio sin que hayas arrancado nada. `enable` hizo su trabajo.

## Paso 5 · El proxy delante

```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/miapp > /dev/null <<'EOF'
server {
  listen 80;
  server_name tu-dominio.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

sudo ln -sf /etc/nginx/sites-available/miapp /etc/nginx/sites-enabled/miapp
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

**Señal:** desde tu propia máquina, no desde el servidor, `curl -s http://tu-dominio.com/health` responde. Y `curl -m 5 http://TU_IP:8080/` **no** responde: el puerto de la aplicación está cerrado al exterior.

## Paso 6 · El certificado

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

Certbot pide un correo, obtiene el certificado y edita tu bloque de nginx para añadir el TLS y la redirección desde el puerto 80.

**Señal:** `curl -sI https://tu-dominio.com/health` devuelve `200`, y `curl -sI http://tu-dominio.com/health` devuelve `301` hacia HTTPS.

## Paso 7 · Comprobar la renovación

El certificado caduca, y lo que falla no es la emisión sino la renovación:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

**Señal:** hay un temporizador programado y el ensayo termina sin errores.

## Si algo no cuadra

| Síntoma | Causa probable | Primer comando |
| --- | --- | --- |
| `ssh marta@TU_IP` pide contraseña | La clave no quedó en su cuenta, o con otro dueño | `ls -la /home/marta/.ssh` desde la sesión de root |
| El servicio queda en `activating (auto-restart)` | El proceso muere al arrancar | `journalctl -u miapp -n 30` |
| nginx responde `502 Bad Gateway` | El proxy funciona y la aplicación no escucha | `curl -s localhost:8080/health` |
| Certbot falla el reto | El DNS no apunta a esta IP, o el puerto 80 está cerrado | `dig +short tu-dominio.com` |

## Qué acabas de hacer a mano

Anota cuánto duró y cuántos pasos tenían un valor que solo tú conocías: el nombre del usuario, la ruta, el puerto, el dominio. Esa lista es el argumento de los módulos siguientes.

| Lo que hiciste a mano | Qué lo automatiza |
| --- | --- |
| Instalar el runtime en la versión correcta | [Contenedores](/containers/) |
| Comprobar que el código funciona antes de subirlo | [Integración continua](/integration/) |
| Copiar el código y reiniciar el servicio | [Desplegar desde el pipeline](/deployment/deploy-from-pipeline/) |
| Aceptar unos segundos de corte al actualizar | [Estrategias de despliegue](/deployment/strategies/) |

## Comprueba lo que entendiste

<details>
<summary>¿Por qué reiniciar la máquina es mejor prueba que cerrar la sesión SSH?</summary>

Porque comprueba las dos cosas que hace un servicio. Cerrar la sesión solo demuestra que el proceso ya no depende de ti; el reinicio demuestra además que el sistema sabe arrancarlo solo, que es lo que hizo `enable`. Un servicio arrancado con `start` y sin `enable` pasa la primera prueba y falla la segunda.

</details>

<details>
<summary>nginx devuelve 502. ¿En qué frontera está el fallo?</summary>

Entre el proxy y la aplicación. Hubo DNS, conexión, TLS y una respuesta HTTP: todo eso lo puso nginx. Lo que falló es el salto a `127.0.0.1:8080`, así que se mira el servicio (`systemctl status miapp`) y no el proxy.

</details>

## Limpieza

Si vas a seguir con las prácticas de despliegue, conserva la máquina. Si no, bórrala desde el panel del proveedor: apagada sigue facturando en la mayoría de ellos. Borra también el registro DNS, para que el nombre no quede apuntando a una IP que mañana será de otra persona.

## Sigue explorando

- [Ubuntu Server · documentación](https://ubuntu.com/server/docs) — la referencia oficial del sistema que acabas de configurar.
- [Certbot · instrucciones](https://certbot.eff.org/instructions) — los pasos exactos para tu combinación de sistema y proxy.
