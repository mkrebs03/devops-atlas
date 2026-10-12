---
title: Despliegue continuo
description: Lleva un artefacto a producción con estrategias seguras y capacidad de revertir.
type: concept
level: intermediate
module: deployment
tools: [nginx, docker]
prerequisites: [integration.github-actions]
learningObjectives:
  - Relacionar integración continua y entrega continua en un mismo recorrido.
  - Reconocer qué hace seguro o riesgoso a un despliegue.
takeaways:
  - Desplegar seguido y en porciones pequeñas reduce el riesgo de cada cambio.
  - Poder revertir rápido importa más que no fallar nunca.
---

**Dónde estás:** ya tienes un artefacto probado. Queda el último tramo, y el más visible: que llegue solo al servidor, ponerlo delante de usuarios reales sin cortar el servicio y poder volver atrás.

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
| Pipeline | ¿Cómo pasa un artefacto de build a release? | [Del build al release](/deployment/pipeline/) |
| Automatización | ¿Cómo llega la imagen al servidor sin que nadie entre por SSH? | [Desplegar desde el pipeline](/deployment/deploy-from-pipeline/) |
| Tráfico | ¿Quién decide a qué instancia llega cada petición? | [Balanceo de carga](/deployment/load-balancing/) |
| Estrategia | ¿Cómo cambio la versión sin tumbar el servicio? | [Estrategias de despliegue](/deployment/strategies/) |
| Práctica | ¿Puedo promover y revertir una versión? | [Práctica · promover y revertir](/deployment/lab-release/) |

:::note[Desplegar no es un evento, es una capacidad]
Un equipo maduro no reza antes de un despliegue anual. Despliega seguido, en porciones pequeñas, y puede revertir en minutos.
:::

## Qué puedes hacer con esto

Con estas páginas puedes describir un pipeline de entrega, hacer que un merge en `main` despliegue solo y vuelva atrás si falla, elegir una estrategia según el riesgo y practicar una promoción con rollback.

## Dónde se rompe esto

| Síntoma | Qué lo causa | Dónde sigue |
| --- | --- | --- |
| El despliegue termina y nadie sabe si el servicio quedó sano | La evidencia se acaba en el pipeline y no continúa en producción | [Observabilidad](/scaling/observability/) |
| Una sola máquina recibe todo el tráfico, y su caída es la caída del servicio | No hay una segunda instancia a la que el balanceador pueda mandar peticiones | [Cuándo escalar y cómo](/scaling/when-to-scale/) |
| El servidor al que despliegas se configuró a mano y nadie sabría rehacerlo | La aplicación está automatizada y la máquina que la sostiene no | [Infraestructura como código](/infrastructure/) |
