---
title: Entrega
description: Lleva un cambio desde el commit hasta un artefacto verificable.
type: concept
level: beginner
module: delivery
tools: [docker, github-actions, ci-cd]
estimatedTime: 10 minutos
prerequisites: [collaboration.git-model, foundations.networking]
learningObjectives:
  - Relacionar commit, validación, paquete y verificación en una ruta de entrega.
  - Identificar la evidencia que debe producir cada etapa de una pipeline.
takeaways:
  - Una pipeline reduce incertidumbre al convertir pasos en comprobaciones repetibles.
  - Un artefacto entregable necesita identidad, contrato y evidencia de funcionamiento.
---

## Entregar es reducir incertidumbre

Una pipeline no existe para verse automatizada. Existe para convertir una intención pequeña en evidencia: el código se puede instalar, probar, empaquetar y publicar bajo condiciones conocidas.

## La cadena de entrega

```text
commit → check → build → package → publish → verify
```

Docker hace visible el paquete. GitHub Actions hace repetible el recorrido. El feedback de cada etapa debe llegar rápido y explicar qué falló.

## Mapa del módulo

| Señal | Qué vas a aprender | Página |
| --- | --- | --- |
| Paquete | Qué significa encapsular una aplicación | [Docker sin magia](./docker/) |
| Workflow | Cómo expresar una comprobación automática | [GitHub Actions](./github-actions/) |
| Evidencia | Cómo verificar una imagen local | [Lab de pipeline](./lab-container-pipeline/) |

:::note El despliegue empieza antes del servidor
Una VPS no debería ser el primer lugar donde descubres que la aplicación no compila. El servidor recibe artefactos que ya atravesaron controles baratos y repetibles.
:::

## Resultado esperado

Al terminar podrás construir una imagen local, describir las etapas de una pipeline y distinguir entre código fuente, artefacto y entorno de ejecución.
