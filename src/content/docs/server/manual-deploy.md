---
title: Desplegar a mano
description: Instalar el runtime, traer el código y arrancar la aplicación, viendo qué cuesta cada paso.
type: concept
module: server
tools: [ssh, git, linux, node]
prerequisites: [server.provisioning]
---

## El despliegue más simple que existe

Tienes una máquina a la que puedes entrar y una aplicación en un repositorio. El camino más corto entre las dos es este, y conviene recorrerlo una vez a mano antes de automatizarlo: los pasos que te resulten molestos son exactamente los que después vas a querer que haga una máquina.

```mermaid
flowchart LR
  R["runtime"] --> C["código"] --> D["dependencias"] --> E["configuración"] --> A["arrancar"]
```

## Instalar el runtime

Tu aplicación necesita el intérprete o la máquina virtual de su lenguaje, y necesita la **misma versión** que usaste al desarrollarla. El paquete que trae la distribución suele estar varias versiones por detrás, así que es normal instalar desde el repositorio del proyecto.

```bash
# el repositorio de NodeSource, para la versión mayor que usas al desarrollar
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node --version     # ¿quedó la versión que esperabas?
psql --version     # ¿y la base de datos?
```

Ejecutar un script descargado con `sudo` es confiar en quien lo publica; léelo antes, o instala desde los pasos manuales que el propio proyecto documenta.

Anota esas versiones. Son la primera pieza de la lista de cosas que un servidor nuevo tendría que reproducir.

## Traer el código

```bash
sudo mkdir -p /srv/miapp && sudo chown marta:marta /srv/miapp
git clone https://github.com/tu-usuario/miapp.git /srv/miapp
cd /srv/miapp && npm ci --omit=dev
```

`npm ci` instala exactamente lo que dice el archivo de bloqueo, en lugar de resolver de nuevo lo que permite el rango de versiones. En un servidor eso importa: quieres las mismas dependencias que probaste, no las últimas compatibles.

Si el repositorio es privado, el servidor necesita credenciales para clonarlo. La opción correcta es una **deploy key**: una clave SSH generada en el servidor, registrada en ese repositorio y solo con permiso de lectura. Un token de tu cuenta personal daría acceso a todo lo que tú puedes ver.

## La configuración no es código

La URL de la base de datos, la clave de la pasarela de pago y el puerto donde escucha cambian entre tu máquina y el servidor. Si viven en el repositorio, o publicas secretos o mantienes archivos distintos por entorno que se desincronizan.

La salida son las **variables de entorno**: valores que el sistema entrega al proceso al arrancarlo, fuera del código.

```bash
sudo install -o marta -g marta -m 600 /dev/null /etc/miapp.env
```

```ini
# /etc/miapp.env — nunca en el repositorio
NODE_ENV=production
PORT=8080
DATABASE_URL=postgres://miapp:...@127.0.0.1:5432/miapp
```

Los permisos `600` importan: el archivo contiene secretos y solo su dueño debe poder leerlo.

:::caution[Un secreto que estuvo en un commit sigue ahí]
Borrarlo en un commit posterior no lo quita del historial: sigue siendo recuperable en cualquier clon del repositorio. Si se te escapa uno, la única respuesta válida es rotarlo —invalidar el valor y emitir uno nuevo—, no borrarlo.
:::

## Arrancar

```bash
cd /srv/miapp
set -a && . /etc/miapp.env && set +a
node server.js
```

La aplicación responde. Y entonces cierras la terminal, y deja de responder.

## Por qué esto no se sostiene

Vale la pena nombrar los fallos ahora, porque cada uno tiene después un responsable concreto:

| Lo que pasa | Por qué |
| --- | --- |
| Cierras SSH y el servicio muere | El proceso es hijo de tu sesión y se va con ella |
| El servidor se reinicia y nada vuelve | Nadie le dijo al sistema que arrancara tu aplicación |
| La aplicación falla y queda caída | No hay nadie vigilando el proceso para reintentarlo |
| Actualizar corta el servicio unos segundos | Paras la versión vieja antes de que la nueva esté lista |
| El servidor nuevo no queda igual que este | Los pasos que diste solo existen en tu memoria |

Los tres primeros los resuelve un gestor de procesos. El cuarto, una estrategia de despliegue. El quinto es el que empuja hacia empaquetar y automatizar.

## Sigue explorando

- [The Twelve-Factor App · configuración](https://12factor.net/es/config) — por qué la configuración vive en el entorno.
- [GitHub · deploy keys](https://docs.github.com/es/authentication/connecting-to-github-with-ssh/managing-deploy-keys) — dar acceso de lectura a un solo repositorio.
