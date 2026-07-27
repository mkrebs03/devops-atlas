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

## Objetivo

Partir de una VPS vacía y terminar con una aplicación respondiendo en `https://tu-dominio` como servicio del sistema, con el certificado emitido y su renovación programada.

## Requisitos

- Una VPS con Ubuntu 24.04 o Debian 12 recién creada, y su IP pública.
- Un dominio cuyo registro DNS `A` ya apunte a esa IP. **Comprueba esto antes de empezar**: sin DNS resuelto, el paso del certificado no puede funcionar.
- Una terminal con `ssh` y `ssh-keygen`.
- Unos 45 minutos.

Los comandos usan `miapp` y `tu-dominio.com`; sustitúyelos por los tuyos.

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
rsync --archive --chown=marta:marta ~/.ssh /home/marta
```

**Señal:** desde una segunda terminal, `ssh marta@TU_IP` entra sin pedir contraseña. No cierres esta primera sesión hasta comprobarlo.

## Paso 2 · Cerrar accesos y puertos

```bash
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Señal:** `sudo ufw status verbose` muestra `deny (incoming)` y solo tres reglas permitidas. Vuelve a entrar desde otra terminal para confirmar que sigues teniendo acceso.

## Paso 3 · Una aplicación mínima

Sin repositorio de por medio, para que el paso sea sobre el servidor y no sobre tu proyecto:

```bash
sudo apt update && sudo apt install -y nodejs
sudo mkdir -p /srv/miapp && sudo chown marta:marta /srv/miapp
cat > /srv/miapp/server.js <<'EOF'
const http = require('http');
const port = process.env.PORT || 8080;
http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end('{"status":"ok"}');
  }
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end(`servida por ${process.pid}\n`);
}).listen(port, '127.0.0.1', () => console.log(`escuchando en ${port}`));
EOF
```

Fíjate en el `'127.0.0.1'` del `listen`: la aplicación no es alcanzable desde fuera, solo a través del proxy.

```bash
printf 'PORT=8080\n' | sudo tee /etc/miapp.env > /dev/null
sudo chmod 600 /etc/miapp.env
```

**Señal:** `node /srv/miapp/server.js` arranca y, desde otra terminal, `curl -s localhost:8080/health` devuelve `{"status":"ok"}`. Detén el proceso con `Ctrl+C`.

## Paso 4 · Convertirla en servicio

```bash
sudo tee /etc/systemd/system/miapp.service > /dev/null <<'EOF'
[Unit]
Description=Practica Atlas
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

**Señal:** el estado dice `active (running)` y `curl -s localhost:8080/health` responde con tu sesión SSH cerrada y vuelta a abrir.

Ahora la prueba que de verdad distingue un servicio de un proceso tuyo:

```bash
sudo reboot
# espera un minuto, vuelve a entrar
curl -s localhost:8080/health
```

Si responde tras el reinicio, `enable` hizo su trabajo.

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

**Señal:** `curl -s http://tu-dominio.com/health` responde desde tu propia máquina, no desde el servidor.

## Paso 6 · El certificado

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

Certbot pide un correo, obtiene el certificado y edita tu bloque de nginx para añadir el TLS y la redirección desde el puerto 80.

**Señal:** `curl -sI https://tu-dominio.com/health` devuelve `200`, y `curl -sI http://tu-dominio.com/health` devuelve `301` hacia HTTPS.

## Paso 7 · Comprobar la renovación

Es el paso que se salta todo el mundo y el que causa la caída tres meses después:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

**Señal:** hay un temporizador programado y el ensayo termina sin errores.

## Qué acabas de hacer a mano

Anota cuánto duró y cuántos pasos tenían un valor que solo tú conocías: el nombre del usuario, la ruta, el puerto, el dominio. Esa lista es el argumento entero de los módulos siguientes.

| Lo que hiciste a mano | Qué lo automatiza |
| --- | --- |
| Instalar el runtime en la versión correcta | [Contenedores](/containers/) |
| Comprobar que el código funciona antes de subirlo | [Integración continua](/integration/) |
| Copiar el código y reiniciar el servicio | [Del build al release](/deployment/pipeline/) |
| Aceptar unos segundos de corte al actualizar | [Estrategias de despliegue](/deployment/strategies/) |

:::note[Esta guía no comprueba tu trabajo]
Las señales de cada paso son para que las verifiques tú. Este sitio no ejecuta nada ni valida ningún resultado.
:::

## Sigue explorando

- [Ubuntu · configuración inicial de un servidor](https://ubuntu.com/server/docs) — la documentación oficial del sistema que acabas de configurar.
- [Certbot · instrucciones](https://certbot.eff.org/instructions) — los pasos exactos para tu combinación de sistema y proxy.
