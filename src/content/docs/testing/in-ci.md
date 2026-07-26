---
title: Pruebas en CI
description: Ejecuta pruebas y lint en cada cambio, y lee la cobertura sin engañarte.
type: tool
level: intermediate
module: testing
tools: [github-actions]
prerequisites: [delivery.github-actions]
learningObjectives:
  - Ejecutar pruebas y lint automáticamente en cada cambio con CI.
  - Interpretar la cobertura sin convertirla en una meta vacía.
  - Ordenar los pasos para obtener feedback lo antes posible.
takeaways:
  - CI ejecuta la suite en un entorno limpio y repetible, no solo en tu máquina.
  - La cobertura mide líneas ejecutadas, no comportamiento verificado.
  - El feedback más útil es el que llega primero y señala la causa.
---

## La suite corre en cada cambio

En Entrega viste que un workflow describe qué ocurre ante eventos. Las pruebas encajan ahí: cada push y cada pull request las ejecuta en un entorno limpio, no solo en tu máquina.

```mermaid
flowchart LR
  PR["pull request"] --> L["lint"] --> U["pruebas de unidad"] --> I["integración"] --> R["resultado"]
```

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
```

Ordena de barato a caro: lint primero (segundos), luego unidad, luego integración. Así el fallo más común aparece antes.

## Cobertura: una brújula, no un destino

La **cobertura** mide qué porcentaje del código ejecutan tus pruebas. Es útil para encontrar zonas sin probar, pero engaña como meta: puedes tener 100% de cobertura y cero afirmaciones útiles. Ejecutar una línea no es lo mismo que verificar su comportamiento.

Úsala para preguntar qué quedó sin probar y por qué, no para perseguir un número.

:::tip[Falla rápido, falla claro]
Un job de CI que tarda 30 minutos desalienta a todo el equipo. Paraleliza, cachea dependencias y pon primero las comprobaciones rápidas.
:::

## Cuando CI falla y tu máquina no

Casi siempre es una diferencia de entorno: una dependencia no fijada, una variable ausente, una prueba que dependía de datos locales. CI es valioso justo por eso: corre en un entorno limpio que revela esos supuestos.

## Comprueba lo que entendiste

<details>
<summary>Tienes 95% de cobertura pero los bugs siguen llegando a producción. ¿Cómo es posible?</summary>

La cobertura solo dice qué líneas se ejecutaron, no si las afirmaste correctamente. Puedes ejecutar código sin comprobar su resultado. Revisa que cada prueba tenga afirmaciones significativas sobre el comportamiento, no solo que pase por ahí.

</details>

<details>
<summary>Una prueba pasa en tu máquina y falla en CI. ¿Cuál es la primera sospecha?</summary>

Una diferencia de entorno: dependencias no fijadas (usa un lockfile y `npm ci`), variables de entorno ausentes, o datos que existían solo en tu máquina. CI corre limpio y por eso expone esos supuestos.

</details>

## Sigue explorando

- [GitHub Actions · pruebas](https://docs.github.com/es/actions/automating-builds-and-tests) — patrones para correr pruebas.
- [Continuous Integration (Martin Fowler)](https://martinfowler.com/articles/continuousIntegration.html) — qué es CI de verdad.
