---
title: Práctica · una prueba y un workflow
description: Escribe una prueba que falle, hazla pasar, y deja que un workflow la ejecute y construya la imagen en cada cambio.
type: practice
module: integration
tools: [node, github-actions, docker, github]
prerequisites: [integration.github-actions, integration.tests-in-ci, containers.lab-container-pipeline]
---

:::note[Práctica escrita, no ejecutada de punta a punta]
No corrí este recorrido completo. La salida que aparece es ilustrativa y puede diferir de la tuya. Si un paso no funciona, [abre un issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## Estado final

`miapp` con una prueba automática, una ruta nueva nacida de esa prueba, y un workflow que en cada pull request ejecuta la suite, construye la imagen y comprueba que el contenedor responde. Y `main` protegida para que nada entre sin pasar por ahí.

## Requisitos

- Node 18 o superior.
- El repositorio `miapp` en GitHub con el `Dockerfile` de la [práctica anterior](/containers/lab-container-pipeline/).
- Unos 30 minutos.

## Paso 1 · Una prueba que falla

La aplicación va a ganar una ruta `/version`. Primero se escribe lo que debe hacer:

```bash
cd ~/miapp
git switch main && git pull --ff-only
git switch -c feat/version

cat > server.test.js <<'EOF'
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const server = require('./server.js');

let base;

before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  server.closeAllConnections();
});

test('GET /health responde ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('GET /version devuelve la versión desplegada', async () => {
  const res = await fetch(`${base}/version`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { version: 'dev' });
});
EOF

node --test
```

La prueba importa `server.js` y lo levanta en el puerto `0`, que significa "el que esté libre": así no choca con nada que ya corra en tu máquina ni en el runner.

**Señal:** una prueba pasa y la otra falla con `404 !== 200`. Es el fallo correcto: la ruta no existe todavía. Si hubiera fallado por un error de sintaxis o de importación, la prueba no estaría diciendo nada sobre `/version`.

## Paso 2 · Hazla pasar

Abre `server.js` y añade la ruta justo antes del bloque de `/`:

```js
  if (req.url === '/version') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ version }) + '\n');
  }
```

```bash
node --test
```

**Señal:** `pass 2`, `fail 0`. La prueba no cambió entre el rojo y el verde; cambió el código.

## Paso 3 · El workflow

```bash
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'EOF'
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: node --test

  image:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Construir la imagen
        run: docker build --tag miapp:ci .
      - name: Prueba de humo
        run: |
          docker run --detach --name miapp --publish 8080:8080 miapp:ci
          curl --fail --silent --show-error \
            --retry 5 --retry-delay 1 --retry-all-errors \
            http://127.0.0.1:8080/health
EOF
```

Dos jobs, en orden de barato a caro. `test` tarda segundos y corre la suite. `image` solo arranca si `test` pasó: construye la imagen y hace lo que hiciste a mano en la práctica anterior, pedirle `/health` al contenedor. `--retry` da margen a que el proceso termine de arrancar.

Las acciones van por etiqueta (`@v4`) para que el archivo se lea bien. En un repositorio real se fijan por SHA, por lo que explica [Secretos y permisos](/integration/secrets/).

## Paso 4 · Míralo correr

```bash
git add server.js server.test.js .github/workflows/ci.yml
git commit -m 'feat: add version route with test and ci'
git push -u origin feat/version
```

Abre el pull request. En la pestaña **Checks** aparecen los dos jobs.

**Señal:** `test` y después `image` terminan en verde, y el pull request los muestra junto al botón de merge. Intégralo.

## Paso 5 · Rómpelo a propósito

Un workflow que nunca viste fallar es una suposición. Cambia el comportamiento sin tocar la prueba:

```bash
git switch main && git pull --ff-only
git switch -c chore/break-health
```

En `server.js`, cambia `{"status":"ok"}` por `{"status":"up"}`. Después:

```bash
git commit -am 'chore: rename health status'
git push -u origin chore/break-health
```

Abre el pull request.

**Señal:** `test` termina en rojo e `image` ni siquiera arranca. Abre el job fallido: el log muestra el nombre de la prueba, el valor esperado y el recibido. Esa línea es lo que un compañero necesitaría para arreglarlo sin preguntarte nada.

Cierra el pull request sin integrarlo y borra la rama:

```bash
git switch main
git branch -D chore/break-health
git push origin --delete chore/break-health
```

## Paso 6 · Que decida, no que informe

Hasta aquí el workflow avisa, pero nada impide integrar en rojo. En el repositorio, entra en **Settings → Branches**, añade una regla para `main` y exige que pasen las comprobaciones `test` e `image` antes de integrar.

**Señal:** en un pull request con las comprobaciones en rojo o en curso, el botón de merge aparece bloqueado.

## Si algo no cuadra

| Síntoma | Causa probable | Qué mirar |
| --- | --- | --- |
| La prueba nueva pasa sin tocar el código | No afirma lo que crees | Los `assert` |
| `Cannot find module './server.js'` | Corres la prueba desde otra carpeta | `pwd` |
| `node --test` no termina | El servidor quedó abierto | El bloque `after` |
| El workflow no aparece en GitHub | El archivo no está en `.github/workflows/` | La ruta y la extensión `.yml` |
| `image` falla en la prueba de humo | El contenedor no escucha en `0.0.0.0` | `ENV HOST` en el `Dockerfile` |
| No encuentras `test` al crear la regla | La comprobación aún no corrió en ese repositorio | Espera a que termine una ejecución |

## Comprueba lo que entendiste

<details>
<summary>¿Por qué la prueba de humo va en un job aparte y no dentro de test?</summary>

Porque comprueban cosas distintas. `test` ejecuta el código con el Node del runner; `image` ejecuta el artefacto que de verdad se va a desplegar. Una imagen puede fallar con todas las pruebas en verde —una variable que falta en el `Dockerfile`, un archivo que no se copió—, y solo la prueba de humo lo ve.

</details>

<details>
<summary>¿Qué cambia al proteger la rama, si el workflow ya corría antes?</summary>

Quién decide. Sin protección, el resultado es un dato que alguien puede ignorar con prisa. Con protección, integrar en rojo deja de ser posible: la comprobación pasa de informar a ser una condición.

</details>

## Limpieza

Nada que borrar: el workflow, la prueba y la regla de la rama son el resultado. La práctica de [promover y revertir](/deployment/lab-release/) usa la imagen que construye este repositorio.
