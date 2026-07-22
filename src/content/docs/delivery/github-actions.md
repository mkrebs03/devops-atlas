---
title: GitHub Actions
description: Convierte el camino de validación en un workflow visible y repetible.
type: tool
level: beginner
module: delivery
tools: [github-actions, ci-cd, yaml]
estimatedTime: 35 minutos
prerequisites: [collaboration.github-flow]
learningObjectives:
  - Interpretar eventos, jobs y pasos dentro de un workflow de GitHub Actions.
  - Diseñar una validación que produzca feedback rápido y comprensible.
takeaways:
  - Un workflow convierte el camino de validación en una promesa ejecutable.
  - Cada etapa debe fallar con evidencia suficiente para orientar la corrección.
---

## Un workflow es una promesa ejecutable

GitHub Actions permite describir qué ocurre ante eventos del repositorio. Un pipeline de documentación puede ser pequeño y aun así enseñar buenas fronteras:

```yaml
name: Validate Atlas

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.29.3
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
```

El workflow no debería esconder el trabajo: cada paso debe decir qué garantiza y qué evidencia deja.

## Validar no es desplegar

Los pull requests ejecutan validaciones sin tocar producción. Solo después de integrar en `main` se construye la imagen publicable y se solicita el despliegue.

:::tip Trata el pipeline como producto
Un error de CI es una experiencia de usuario. Mensajes cortos, comandos reproducibles y artefactos visibles reducen el tiempo entre fallo y aprendizaje.
:::

## Secretos y permisos

Los secretos viven en GitHub, no en YAML ni en el repositorio. Concede a cada job lo mínimo: leer código para validar y escribir paquetes solo en el job que publica una imagen.
