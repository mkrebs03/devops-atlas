---
title: Pruebas
description: Convierte la confianza en evidencia con pruebas automáticas y feedback rápido.
type: concept
level: beginner
module: testing
tools: [node]
prerequisites: [collaboration.github-flow]
learningObjectives:
  - Explicar por qué las pruebas automáticas convierten la confianza en evidencia.
  - Reconocer qué cambia cuando la suite pasa a ser una compuerta del camino de entrega.
  - Ubicar dónde vive cada tipo de prueba en el recorrido de un cambio.
takeaways:
  - Una prueba es una afirmación ejecutable sobre el comportamiento del sistema.
  - En CI la suite deja de ser un seguro personal y pasa a ser evidencia compartida.
  - El valor de una prueba está en el feedback rápido, no en el número de pruebas.
---

**Dónde estás:** en Fundamentos aprendiste a observar; en Colaboración, a revisar; en Entrega, a empaquetar. Probar cierra el círculo: convierte "creo que funciona" en "puedo demostrar que funciona".

## Probar es afirmar con evidencia

Una prueba automática es una afirmación ejecutable: dado cierto input, el sistema responde de cierta forma. Cuando falla, no discutes opiniones; lees una evidencia concreta y reproducible.

Si ya programas, probablemente esto no sea nuevo. Lo que cambia en DevOps es dónde vive la suite: deja de ser una comprobación que corres cuando te acuerdas y pasa a ser una **compuerta del camino de entrega**. Se ejecuta sola en cada cambio, en un entorno limpio que no es el tuyo, y su resultado decide si el artefacto sigue avanzando. Una prueba deja de ser tu seguro personal y pasa a ser evidencia compartida.

## El recorrido

```mermaid
flowchart LR
  U["unidad"] --> I["integración"] --> E["extremo a extremo"] --> CI["en CI"]
```

| Momento | Pregunta | Página |
| --- | --- | --- |
| Pirámide | ¿Qué probar y en qué nivel? | [La pirámide de pruebas](/testing/pyramid/) |
| Automatización | ¿Cómo corren las pruebas en cada cambio? | [Pruebas en CI](/testing/in-ci/) |
| Práctica | ¿Puedo escribir y ejecutar una prueba? | [Práctica · tu primera prueba](/testing/lab-first-test/) |

:::note[Una prueba que nunca falla no protege nada]
Si una prueba pasa siempre, aunque rompas el código, no está probando lo que crees. Una buena prueba falla cuando el comportamiento cambia.
:::

## Qué puedes hacer con esto

Con estas páginas puedes distinguir los niveles de prueba, decidir qué automatizar en CI y escribir una primera prueba que falle por la razón correcta.
