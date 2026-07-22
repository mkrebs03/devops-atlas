---
title: Lab · pipeline local
description: Construye una imagen estática, ejecútala y verifica su contrato HTTP.
type: lab
level: beginner
module: delivery
tools: [docker, nginx, curl]
estimatedTime: 35 minutos
prerequisites: [docker, networking]
---

## Objetivo

Vas a convertir un archivo HTML en una imagen Docker y verificar que el proceso dentro del contenedor sirve exactamente el artefacto esperado.

## Paso 1 · crea un sitio mínimo

```bash
mkdir -p /tmp/atlas-container-lab
cd /tmp/atlas-container-lab
printf '<h1>Atlas pipeline green</h1>\n' > index.html
cat > Dockerfile <<'EOF'
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EOF
```

## Paso 2 · construye y ejecuta

```bash
docker build --tag atlas-lab:local .
docker run --detach --rm --name atlas-lab --publish 8080:80 atlas-lab:local
curl --fail http://127.0.0.1:8080/
```

La respuesta debe contener `Atlas pipeline green`. Si el contenedor no arranca, revisa primero la imagen construida y después el puerto publicado.

## Paso 3 · inspecciona la evidencia

```bash
docker ps --filter name=atlas-lab
docker logs atlas-lab
docker image inspect atlas-lab:local --format '{{.Id}}'
```

## Verificación y limpieza

```bash
docker stop atlas-lab
rm -rf /tmp/atlas-container-lab
```

:::note Una imagen es un artefacto
La pipeline real no debería depender de archivos que existan por casualidad en la VPS. Construye el artefacto una vez, identifica su versión y promueve esa misma versión.
:::
