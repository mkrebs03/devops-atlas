---
title: Colaboración
description: Convierte cambios individuales en decisiones que el equipo puede entender y revisar.
type: concept
level: beginner
module: collaboration
tools: [git, github]
prerequisites: [foundations.terminal]
learningObjectives:
  - Explicar cómo Git convierte cambios locales en una historia revisable.
  - Reconocer los acuerdos que permiten colaborar sin perder contexto.
takeaways:
  - Entregar un cambio también exige comunicar su intención y su historia.
  - Los cambios pequeños, revisables y reversibles reducen el riesgo del equipo.
---

**Dónde estás:** en Fundamentos aprendiste a leer una máquina. Aquí el cambio deja de ser solo tuyo: entra un equipo, y con él la necesidad de que tu trabajo se pueda revisar, explicar y deshacer.

## Entregar también es coordinar

Un cambio de software no termina cuando funciona en tu máquina. Debe tener una historia que otra persona pueda leer, un lugar claro para revisar la intención y una forma de volver atrás.

Git aporta el mapa local; la colaboración añade acuerdos: ramas pequeñas, commits con propósito, revisión y una rama principal protegida.

## De tu máquina al estado compartido

```mermaid
flowchart LR
  L["cambio local"] --> B["rama"] --> PR["pull request"] --> Rev["revisión + CI"] --> Main["main protegida"]
```

## El recorrido

| Momento | Pregunta | Página |
| --- | --- | --- |
| Modelo | ¿Qué representa un commit? | [El modelo de Git](./git-model/) |
| Cambio | ¿Cómo trabajo sin pisar la rama principal? | [GitHub Flow](./github-flow/) |
| Revisión | ¿Qué debe poder entender otra persona? | [GitHub Flow](./github-flow/) |
| Práctica | ¿Puedo crear y deshacer un cambio seguro? | [Práctica · ramas seguras](./lab-git-branching/) |

:::note[El historial es una interfaz]
Un buen historial no registra cada movimiento del teclado. Registra decisiones pequeñas, coherentes y reversibles.
:::

## Resultado esperado

Al terminar podrás crear una rama con intención, mantenerla actualizada, explicar un diff y abrir un cambio que otra persona pueda revisar sin reconstruir tu contexto desde cero.
