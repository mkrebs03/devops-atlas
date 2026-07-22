---
title: Fundamentos
description: Aprende a leer una máquina antes de intentar automatizarla.
type: concept
level: beginner
module: foundations
tools: [linux, terminal, networking]
estimatedTime: 10 minutos
prerequisites: []
learningObjectives:
  - Identificar las señales básicas de una máquina y una red antes de cambiar el sistema.
  - Ordenar preguntas de diagnóstico para investigar un fallo con evidencia.
takeaways:
  - Observar el sistema antes de actuar reduce cambios innecesarios.
  - Máquina, proceso y red forman un mapa común para investigar problemas.
---

## La primera habilidad: observar

DevOps no empieza con una herramienta. Empieza con la capacidad de hacer preguntas concretas sobre un sistema: qué proceso está escuchando, qué archivo cambió, por qué una petición no llega y qué evidencia respalda una decisión.

En este módulo vas a construir el mapa mínimo para moverte por Linux y una red. No necesitas memorizar cientos de comandos; necesitas aprender a encadenar observaciones pequeñas.

## El mapa de fundamentos

| Señal | Pregunta útil | Página |
| --- | --- | --- |
| Máquina | ¿Dónde estoy y qué recursos tengo? | [Linux y terminal](./linux-cli/) |
| Proceso | ¿Qué está ejecutándose y quién lo inició? | [Linux y terminal](./linux-cli/#procesos-y-servicios) |
| Red | ¿La aplicación escucha y puede ser alcanzada? | [Redes esenciales](./networking/) |
| Práctica | ¿Puedo reproducir una investigación? | [Lab de shell y red](./lab-shell-and-network/) |

:::tip Cambia el orden de tus preguntas
Cuando algo falla, recorre el sistema de afuera hacia adentro: DNS → conexión → puerto → proceso → archivo → configuración. Esa secuencia reduce la tentación de cambiar cinco cosas a la vez.
:::

## Resultado esperado

Al terminar podrás describir el recorrido de una petición, encontrar un proceso y verificar una conexión usando herramientas locales. Ese vocabulario será la base de Git, Docker y CI/CD.
