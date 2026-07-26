---
title: Práctica · pipeline local
description: Construye una imagen estática, ejecútala, observa la caché de capas y verifica su contrato HTTP.
type: practice
level: beginner
module: delivery
tools: [docker, nginx, curl]
prerequisites: [delivery.docker, foundations.networking]
learningObjectives:
  - Construir una imagen reproducible que contenga un sitio estático.
  - Ejecutar el contenedor y verificar su contrato mediante una petición HTTP.
  - Observar cómo la caché de capas acelera una reconstrucción.
takeaways:
  - Construir, ejecutar y verificar son etapas separadas de la entrega.
  - Una comprobación HTTP confirma que el artefacto responde como se espera.
  - El orden del Dockerfile cambia qué capas se reutilizan al reconstruir.
---

## Objetivo

Vas a convertir un archivo HTML en una imagen Docker, verificar que el contenedor sirve exactamente el artefacto esperado y observar la caché de capas al reconstruir.

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

## Paso 3 · observa la caché de capas

Cambia el contenido y reconstruye:

```bash
printf '<h1>Atlas pipeline green v2</h1>\n' > index.html
docker build --tag atlas-lab:local .
```

En la salida verás `CACHED` en la capa `FROM nginx:alpine` (no cambió) y una reconstrucción solo de la capa `COPY index.html`. Docker reutiliza lo que puede: por eso el orden de las instrucciones importa.

## Paso 4 · inspecciona la evidencia

```bash
docker ps --filter name=atlas-lab
docker logs atlas-lab
docker image inspect atlas-lab:local --format '{{.Id}}'
```

## Cuando algo no cuadra

| Síntoma | Causa probable | Comando |
| --- | --- | --- |
| `Connection refused` | El contenedor no arrancó o el puerto no está publicado | `docker ps` |
| `404 Not Found` | El archivo no quedó en la ruta que sirve nginx | `docker exec atlas-lab ls /usr/share/nginx/html` |
| La build falla | Error en el Dockerfile o el contexto | lee la línea que reporta `docker build` |

## Verificación y limpieza

La afirmación comprobable es: el contenedor sirve el artefacto que construí, y una reconstrucción reutiliza las capas que no cambiaron.

```bash
docker stop atlas-lab
rm -rf /tmp/atlas-container-lab
```

## Comprueba lo que entendiste

<details>
<summary>Reconstruyes tras cambiar solo index.html y la capa FROM aparece como CACHED. Es correcto?</summary>

Sí: la instrucción `FROM nginx:alpine` no cambió, así que Docker reutiliza esa capa y solo rehace el `COPY` del archivo modificado. Esa reutilización es justo lo que hace rápidas las reconstrucciones.

</details>

:::note[Una imagen es un artefacto]
La pipeline real no debería depender de archivos que existan por casualidad en la VPS. Construye el artefacto una vez, identifica su versión y promueve esa misma versión.
:::
