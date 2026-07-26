---
title: Despliegue
description: Lleva un artefacto a producción con estrategias seguras y capacidad de revertir.
type: concept
level: intermediate
module: deployment
tools: [ci-cd, deployment]
prerequisites: [delivery.github-actions]
learningObjectives:
  - Relacionar integración continua y entrega continua en un mismo recorrido.
  - Reconocer qué hace seguro o riesgoso a un despliegue.
takeaways:
  - Desplegar seguido y en porciones pequeñas reduce el riesgo de cada cambio.
  - Poder revertir rápido importa más que no fallar nunca.
---

## De integrar a entregar

Ya construyes un artefacto y lo pruebas en CI. Desplegar es el último tramo: llevar ese artefacto a las manos de una persona, bajo condiciones controladas y con una salida de emergencia.

La **integración continua (CI)** mantiene el código siempre integrable. La **entrega continua (CD)** mantiene el artefacto siempre desplegable, y a veces lo despliega sola.

```mermaid
flowchart LR
  A["artefacto probado"] --> S["staging"] --> Ap["aprobación"] --> P["producción"] --> V["verificar + poder revertir"]
```

## El recorrido

| Momento | Pregunta | Página |
| --- | --- | --- |
| Pipeline | ¿Cómo pasa un artefacto de build a release? | [Del build al release](./pipeline/) |
| Tráfico | ¿Quién decide a qué instancia llega cada petición? | [Proxy inverso y balanceo](./proxy/) |
| Estrategia | ¿Cómo cambio la versión sin tumbar el servicio? | [Estrategias de despliegue](./strategies/) |
| Evidencia | ¿Cómo sé que la versión nueva se comporta bien? | [Observabilidad](./observability/) |
| Práctica | ¿Puedo promover y revertir una versión? | [Lab · promover y revertir](./lab-release/) |

:::note[Desplegar no es un evento, es una capacidad]
Un equipo maduro no reza antes de un despliegue anual. Despliega seguido, en porciones pequeñas, y puede revertir en minutos.
:::

## Resultado esperado

Al terminar podrás describir un pipeline de entrega, elegir una estrategia de despliegue según el riesgo, saber qué mirar en los minutos siguientes, y practicar una promoción con rollback.
