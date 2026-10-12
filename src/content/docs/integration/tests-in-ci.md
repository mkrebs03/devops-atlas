---
title: Pruebas en CI
description: Ejecutar la suite en cada cambio, con las dependencias que necesita, y cómo leer la cobertura.
type: tool
module: integration
tools: [github-actions, postgresql, docker]
prerequisites: [integration.github-actions, integration.pyramid]
---

## La suite corre en cada cambio

Un workflow describe qué ocurre ante eventos del repositorio, como viste en [GitHub Actions](/integration/github-actions/). Las pruebas encajan ahí: cada push y cada pull request las ejecuta en un entorno limpio, no solo en tu máquina.

```mermaid
flowchart LR
  PR["pull request"] --> L["lint"] --> U["unidad"] --> I["integración"] --> B["build"] --> H["prueba de humo"]
```

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

Ordena de barato a caro: lint primero (segundos), luego unidad, luego integración. Así el fallo más común aparece antes, y nadie espera ocho minutos para enterarse de que faltaba un punto y coma.

## Una base de datos para las pruebas de integración

Una prueba de integración necesita la pieza con la que se integra. El runner nace vacío, así que hay que pedírsela. `services` arranca un contenedor junto al job y lo destruye al terminar:

```yaml
jobs:
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 5s
          --health-retries 10
    env:
      DATABASE_URL: postgres://postgres:postgres@127.0.0.1:5432/postgres
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:integration
```

Dos detalles sostienen ese bloque. El `--health-cmd` hace que el job no empiece hasta que la base de datos acepte conexiones: es el mismo problema de "arrancar no es estar listo" que resuelve `depends_on` en [Compose](/containers/compose/). Y la contraseña está escrita a la vista porque no protege nada: esa base de datos vive unos minutos, vacía, dentro de una máquina que se destruye.

Usa la misma versión mayor que en producción. Una suite que pasa contra otro motor, o contra una versión distinta, afirma algo sobre un sistema que no es el tuyo.

## Probar el artefacto, no solo el código

Todo lo anterior ejecuta el código con el Node del runner. Lo que se despliega es otra cosa: una imagen. Entre una y otra caben fallos que ninguna prueba de unidad ve —un archivo que no se copió, una variable que falta, un proceso que escucha en la interfaz equivocada—.

```yaml
  image:
    needs: [test, integration]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build --tag miapp:ci .
      - run: |
          docker run --detach --publish 8080:8080 miapp:ci
          curl --fail --retry 5 --retry-delay 1 --retry-all-errors http://127.0.0.1:8080/health
```

Eso es una **prueba de humo**: arrancar el artefacto y pedirle lo mínimo. No sustituye a la suite; comprueba lo único que la suite no puede comprobar.

## Cobertura

La **cobertura** mide qué porcentaje del código ejecutan tus pruebas. Es útil para encontrar zonas sin probar, pero engaña como meta: puedes tener 100% de cobertura y cero afirmaciones útiles. Ejecutar una línea no es lo mismo que verificar su comportamiento.

Úsala para preguntar qué quedó sin probar y por qué, no para perseguir un número.

## Cuando CI falla y tu máquina no

Casi siempre es una diferencia de entorno, y casi siempre es una de estas:

| Lo que ves | Causa habitual | Qué comprobar |
| --- | --- | --- |
| Falla al instalar | El archivo de bloqueo no coincide con el manifiesto | Que `npm ci` pase en local desde una carpeta limpia |
| Falla una prueba que usa la hora o la zona | El runner está en UTC | Fijar la zona en la prueba, no en la máquina |
| Falla solo a veces | La prueba depende del orden o de un tiempo de espera | Ejecutarla sola y repetida |
| No encuentra una variable | Existía en tu terminal, no en el repositorio | El bloque `env` del job |

CI es valioso justo por eso: corre en un entorno limpio que revela supuestos que no sabías que tenías.

:::tip[Comprobaciones rápidas primero]
Un job de CI que tarda 30 minutos retrasa cada cambio. Paraleliza, cachea dependencias y pon primero las comprobaciones rápidas.
:::

## Sigue explorando

- [GitHub Actions · contenedores de servicio](https://docs.github.com/es/actions/use-cases-and-examples/using-containerized-services/about-service-containers) — bases de datos y otras dependencias dentro del job.
- [Continuous Integration (Martin Fowler)](https://martinfowler.com/articles/continuousIntegration.html) — qué es CI de verdad.
