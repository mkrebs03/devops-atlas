---
title: Práctica · investigar una aplicación local
description: Arranca la aplicación de ejemplo, encuentra su puerto y separa un fallo de conexión de uno de aplicación.
type: practice
module: foundations
tools: [node, curl, ss]
prerequisites: [foundations.terminal, foundations.networking]
---

:::note[Práctica escrita, no ejecutada de punta a punta]
No corrí este recorrido completo. La salida que aparece es ilustrativa y puede diferir de la tuya. Si un paso no funciona, [abre un issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## Estado final

La [aplicación de ejemplo](/sample-app/) corriendo en tu máquina, y tres evidencias separadas: que escucha, que responde, y qué aspecto tiene cada tipo de fallo. La carpeta que creas aquí la siguen usando las demás prácticas.

## Requisitos

- Dos terminales.
- Node 18 o superior y `curl`.
- `ss`, que viene en cualquier Linux. En macOS no existe: usa `lsof -nP -iTCP -sTCP:LISTEN` donde la práctica dice `ss -lnt`.
- Unos 15 minutos.

## Paso 1 · Arranca la aplicación

Crea la carpeta `~/miapp` y guarda dentro el `server.js` de [La aplicación de ejemplo](/sample-app/#el-archivo). Después:

```bash
cd ~/miapp
node server.js
```

**Señal:** la terminal imprime `escuchando en 127.0.0.1:8080` y se queda ocupada. Déjala así y sigue en la segunda.

## Paso 2 · Dos evidencias, no una

```bash
ss -lntp | grep ':8080'
curl -i http://127.0.0.1:8080/health
```

**Señal:** un socket en estado `LISTEN` sobre `127.0.0.1:8080`, y una respuesta que empieza así:

```text
HTTP/1.1 200 OK
content-type: application/json
...
{"status":"ok"}
```

Son evidencias distintas. El socket dice "hay algo escuchando"; el `200` dice "la aplicación respondió lo que esperaba". La opción `-p` añade el proceso dueño del socket; para ver procesos de otro usuario hace falta `sudo`.

## Paso 3 · Un fallo de aplicación

Pide una ruta que no existe, sin detener el servidor:

```bash
curl -i http://127.0.0.1:8080/no-existe
```

**Señal:** `HTTP/1.1 404 Not Found`. Hubo conexión y hubo respuesta HTTP: el servidor está disponible y te dice que ese recurso no existe. Es la frontera de **aplicación**.

## Paso 4 · Un fallo de conexión

Ahora consulta un puerto donde nadie escucha:

```bash
curl -i http://127.0.0.1:9090/health
```

**Señal:** `curl` termina con el error `(7)` y un mensaje que incluye `Connection refused` o `Couldn't connect to server`, según la versión. No hay línea `HTTP/...` porque nunca hubo HTTP: es la frontera de **conexión**.

## Paso 5 · Mueve el puerto

Detén el servidor con `Ctrl+C` y arráncalo en otro puerto, sin tocar el archivo:

```bash
PORT=9090 node server.js
```

Repite los dos `curl` a `/health`, el de `8080` y el de `9090`.

**Señal:** se invirtieron. Ahora `9090` responde `200` y `8080` rechaza la conexión. El código es el mismo; cambió una variable de entorno, que es la forma en que esta aplicación va a recibir su configuración en todas las prácticas siguientes.

## Si algo no cuadra

| Síntoma | Frontera probable | Primer comando |
| --- | --- | --- |
| `Connection refused` | Nada escucha ese puerto | `ss -lnt` |
| Se queda colgado (timeout) | Firewall o dirección de escucha | `curl -v` |
| `404 Not Found` | Ruta o recurso inexistente | `curl -i` |
| `EADDRINUSE` al arrancar | Otro proceso ya ocupa el puerto | `ss -lntp` |

## Limpieza

Detén el servidor con `Ctrl+C`. **No borres `~/miapp`**: la práctica de [ramas seguras](/collaboration/lab-git-branching/) empieza en esa carpeta.
