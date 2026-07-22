---
title: GitHub Flow
description: Un flujo pequeño para proponer, revisar y entregar cambios sin perder el contexto.
type: tool
level: beginner
module: collaboration
tools: [git, github, pull-requests]
estimatedTime: 30 minutos
prerequisites: [git-model]
---

## El flujo en cinco movimientos

```text
main → branch → commit → pull request → merge
```

La rama principal representa el estado que el equipo está dispuesto a compartir. Una rama de trabajo crea un espacio temporal para una intención concreta.

```bash
git switch main
git pull --ff-only
git switch -c feat/health-check
```

## Pull requests como conversación

Un pull request no es solo un botón de merge. Es una superficie para explicar:

1. Qué problema resuelve el cambio.
2. Qué decisiones tomó quien lo implementó.
3. Cómo se verificó.
4. Qué riesgo queda pendiente.

La descripción y el diff deben permitir que una revisión sea específica. “Se ve bien” no ayuda tanto como “el endpoint devuelve `503` cuando falta la dependencia, y el test cubre ese caso”.

## CI como participante

La automatización no reemplaza la revisión humana, pero elimina comprobaciones repetitivas: formato, tipos, tests y build. Si una comprobación falla, el estado debe ser accionable y apuntar a una evidencia.

:::caution No mezcles limpieza con una feature
Un pull request que cambia comportamiento, renombra archivos y reformatea todo el proyecto cuesta más de revisar. Divide la intención para conservar una señal clara.
:::
