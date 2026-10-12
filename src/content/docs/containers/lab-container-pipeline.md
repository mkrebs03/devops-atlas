---
title: Práctica · empaquetar miapp
description: Convierte la aplicación de ejemplo en una imagen, descubre por qué no responde a la primera y descríbela con Compose.
type: practice
module: containers
tools: [docker, docker-compose, curl]
prerequisites: [containers.docker, containers.compose]
---

:::note[Práctica escrita, no ejecutada de punta a punta]
No corrí este recorrido completo. La salida que aparece es ilustrativa y puede diferir de la tuya. Si un paso no funciona, [abre un issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## Estado final

`miapp` empaquetada en una imagen, corriendo como servicio de Compose con chequeo de salud, y con el `Dockerfile` y el `compose.yml` guardados en el repositorio. Por el camino vas a provocar el fallo más común al meter una aplicación en un contenedor.

## Requisitos

- Docker en ejecución, con `docker compose` disponible.
- La carpeta `~/miapp` con su repositorio. Si entras por aquí, créala con el `server.js` de [La aplicación de ejemplo](/sample-app/#el-archivo).
- Unos 25 minutos.

## Paso 1 · El primer Dockerfile

```bash
cd ~/miapp
printf '.git\nnode_modules\n.env\n' > .dockerignore
cat > Dockerfile <<'EOF'
FROM node:22-alpine
WORKDIR /app
COPY server.js ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]
EOF

docker build --tag miapp:local .
docker run --detach --rm --name miapp --publish 127.0.0.1:8080:8080 miapp:local
```

`USER node` hace que el proceso no corra como `root` dentro del contenedor. `.dockerignore` deja fuera del build lo que no debe viajar en la imagen.

**Señal:** `docker ps` muestra el contenedor `miapp` en estado `Up`, y `docker logs miapp` dice `escuchando en 127.0.0.1:8080`.

## Paso 2 · Arranca y no responde

```bash
curl -i http://127.0.0.1:8080/health
```

**Señal:** falla. El mensaje depende de cómo tu instalación de Docker reenvía el puerto: `Connection reset by peer` en Linux, `Empty reply from server` en Docker Desktop, `Couldn't connect to server` en Colima y otras máquinas virtuales.

Como el mensaje cambia, no es la evidencia. Recorre las fronteras como en [Fundamentos](/foundations/networking/) con lo que sí es estable: `docker ps` dice que el contenedor está `Up` y que el puerto está publicado, así que el fallo no es que no corra. Y el log dice que la aplicación escucha en `127.0.0.1`. Dentro de un contenedor esa dirección es **el contenedor**, no tu máquina: Docker entrega el tráfico por la interfaz de red del contenedor, donde no escucha nadie.

Compruébalo desde dentro, donde `127.0.0.1` sí es la aplicación:

```bash
docker exec miapp wget -qO- http://127.0.0.1:8080/health
# {"status":"ok"}
```

La aplicación está sana. Lo que falla es desde dónde se la puede alcanzar.

## Paso 3 · Corrige la imagen, y después el contenedor

La aplicación lee `HOST` del entorno. Dentro de un contenedor tiene que escuchar en todas sus interfaces:

```bash
cat > Dockerfile <<'EOF'
FROM node:22-alpine
WORKDIR /app
COPY server.js ./
ENV HOST=0.0.0.0
USER node
EXPOSE 8080
CMD ["node", "server.js"]
EOF

docker build --tag miapp:local .
curl -i http://127.0.0.1:8080/health
```

**Señal:** el build marca `CACHED` en `WORKDIR` y en `COPY` (`Using cache` si tu Docker usa el constructor antiguo) —no cambiaron, así que no se rehacen—, y el `curl` **sigue fallando**.

Ese segundo resultado es la lección. Reconstruiste la imagen, pero el contenedor que corre nació de la anterior y una imagen nueva no lo toca. Hay que reemplazarlo:

```bash
docker stop miapp
docker run --detach --rm --name miapp --publish 127.0.0.1:8080:8080 miapp:local
curl -i http://127.0.0.1:8080/health
```

**Señal:** `HTTP/1.1 200 OK`. Fíjate en que `0.0.0.0` es dentro del contenedor; hacia fuera, quien decide el alcance es `--publish 127.0.0.1:8080:8080`, que solo abre el puerto en tu propia máquina.

## Paso 4 · La misma imagen, otra configuración

```bash
docker stop miapp
docker run --detach --rm --name miapp --publish 127.0.0.1:8080:8080 \
  --env APP_VERSION=v1 miapp:local
curl -s http://127.0.0.1:8080/
```

**Señal:** `miapp v1`. No reconstruiste nada: la imagen es la misma y cambió lo que recibe al arrancar. Es la idea de "un artefacto, varias configuraciones" que después atraviesa entornos.

```bash
docker stop miapp
```

## Paso 5 · Descríbelo con Compose

Las banderas que llevas tecleando pasan a un archivo:

```bash
cat > compose.yml <<'EOF'
services:
  app:
    build: .
    environment:
      APP_VERSION: ${APP_VERSION:-compose}
    ports:
      - "127.0.0.1:8080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/health"]
      interval: 10s
      timeout: 3s
      retries: 3
EOF

docker compose up --detach --build
docker compose ps
curl -s http://127.0.0.1:8080/
```

**Señal:** `curl` responde `miapp compose` y, pasados unos segundos, `docker compose ps` muestra el servicio como `healthy`. Ese estado sale del `healthcheck`: Docker llama a `/health` desde dentro del contenedor cada diez segundos.

## Paso 6 · Guárdalo

```bash
git switch -c feat/container
git add Dockerfile .dockerignore compose.yml
git commit -m 'feat: package miapp as a container'
git push -u origin feat/container
```

Abre el pull request e intégralo, como en la [práctica de ramas](/collaboration/lab-git-branching/). Desde ese commit, cualquiera que clone el repositorio construye la misma imagen sin que tú le expliques nada.

## Si algo no cuadra

| Síntoma | Causa probable | Comando |
| --- | --- | --- |
| `curl` falla y `docker ps` no muestra el contenedor | No arrancó, o el puerto no está publicado | `docker ps --all` |
| `curl` falla con el contenedor `Up` | La aplicación escucha en `127.0.0.1` dentro del contenedor | `docker logs miapp` |
| `port is already allocated` | Otro contenedor u otro proceso ocupa el 8080 | `docker ps`, `ss -lntp` |
| El servicio queda `unhealthy` | El chequeo no llega a `/health` | `docker compose logs app` |
| El cambio no se nota | Reconstruiste la imagen y no reemplazaste el contenedor | `docker compose up --detach --build` |

## Comprueba lo que entendiste

<details>
<summary>La aplicación escucha en 0.0.0.0 dentro del contenedor. ¿Queda expuesta a internet?</summary>

No por eso. `0.0.0.0` se refiere a las interfaces del contenedor, que vive en una red privada de Docker. Lo que decide si se alcanza desde fuera es cómo publicas el puerto: `127.0.0.1:8080:8080` solo lo abre en la máquina anfitriona; `8080:8080` lo abriría en todas sus interfaces.

</details>

<details>
<summary>Reconstruiste la imagen y el contenedor sigue respondiendo lo de antes. ¿Por qué?</summary>

Porque un contenedor se crea a partir de la imagen que existía en ese momento y no vuelve a mirarla. La etiqueta `miapp:local` ahora apunta a una imagen nueva, pero el proceso que corre sigue siendo el de la vieja. Hay que parar el contenedor y crear otro, que es lo que hace `docker compose up --build`.

</details>

## Limpieza

```bash
docker compose down
docker image rm miapp:local
```

Conserva los tres archivos en el repositorio: la [práctica de CI](/integration/lab-ci/) construye esta misma imagen en cada cambio.
