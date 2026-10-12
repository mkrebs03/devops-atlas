---
title: La aplicación de ejemplo
description: El servicio mínimo que recorren todas las prácticas del Atlas, de tu máquina hasta un despliegue automático.
---

Todas las prácticas del Atlas trabajan sobre la misma aplicación, `miapp`: un servidor HTTP de un solo archivo, sin dependencias. Es pequeña a propósito. Lo que cambia de una práctica a la siguiente no es la aplicación, sino dónde corre y quién la pone ahí.

## El archivo

Necesitas Node 18 o superior. Crea una carpeta `miapp` en tu directorio personal y guarda esto como `server.js`:

```js
const http = require('node:http');

const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';
const version = process.env.APP_VERSION || 'dev';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end('{"status":"ok"}\n');
  }
  if (req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    return res.end(`miapp ${version}\n`);
  }
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('not found\n');
});

if (require.main === module) {
  server.listen(port, host, () => console.log(`escuchando en ${host}:${port}`));
}

module.exports = server;
```

```bash
node server.js
# escuchando en 127.0.0.1:8080
```

## Qué expone

| Ruta | Responde | Para qué se usa |
| --- | --- | --- |
| `/` | `miapp <versión>` | Ver qué versión está atendiendo |
| `/health` | `{"status":"ok"}` | Chequeos de salud y pruebas de humo |
| `/version` | `404`, por ahora | La añades tú en la [práctica de CI](/integration/lab-ci/), empezando por su prueba |
| cualquier otra | `404 not found` | Distinguir un fallo de aplicación de uno de conexión |

## Qué configuración lee

La aplicación no lleva ningún valor fijo: todo lo que cambia entre entornos entra por variables.

| Variable | Por defecto | Por qué importa |
| --- | --- | --- |
| `PORT` | `8080` | El puerto donde escucha |
| `HOST` | `127.0.0.1` | La interfaz donde escucha. En un servidor se queda en local, detrás del proxy; dentro de un contenedor tiene que ser `0.0.0.0` |
| `APP_VERSION` | `dev` | La versión que anuncia. El pipeline la fija al construir la imagen |

Las dos últimas líneas del archivo hacen que el servidor solo empiece a escuchar cuando lo ejecutas directamente. Si otro archivo lo importa —una prueba—, recibe el servidor sin arrancar y decide en qué puerto levantarlo.

## Dónde aparece

| Práctica | Qué le pasa a `miapp` |
| --- | --- |
| [Investigar una aplicación local](/foundations/lab-shell-and-network/) | Corre en tu máquina y la inspeccionas con `ss` y `curl` |
| [Ramas seguras](/collaboration/lab-git-branching/) | Entra en un repositorio y llega a GitHub |
| [De VPS vacía a HTTPS](/server/lab-vps-deploy/) | Corre en un servidor como servicio, detrás de nginx |
| [Empaquetar miapp](/containers/lab-container-pipeline/) | Se convierte en una imagen y en un servicio de Compose |
| [Una prueba y un workflow](/integration/lab-ci/) | Gana una prueba y un workflow que la ejecuta en cada cambio |
| [Promover y revertir](/deployment/lab-release/) | Dos versiones conviven y un proxy decide cuál recibe tráfico |

Cada práctica dice qué necesita de las anteriores. Si entras por el medio, este archivo es todo lo que hace falta para empezar.
