---
title: El modelo de Git
description: Commits, ramas y referencias como un mapa de decisiones, no como botones misteriosos.
type: concept
level: beginner
module: collaboration
tools: [git]
estimatedTime: 35 minutos
prerequisites: [foundations.linux-cli]
learningObjectives:
  - Relacionar commits, ramas y HEAD dentro del grafo de Git.
  - Usar el diff y el historial para explicar una decisión de código.
takeaways:
  - Una rama es una referencia móvil y un commit es una instantánea conectada.
  - El diff es la unidad mínima para revisar y conversar sobre un cambio.
---

## Tres objetos que explican casi todo

Git guarda instantáneas conectadas:

- Un **commit** describe un estado y apunta a su padre.
- Una **rama** es una referencia móvil que nombra una línea de commits.
- `HEAD` indica dónde estás trabajando ahora.

Puedes observar el mapa sin modificarlo:

```bash
git status
git log --oneline --graph --decorate --all
git show --stat HEAD
```

## El diff es la unidad de conversación

Antes de guardar un commit, revisa qué cambió:

```bash
git diff
git diff --cached
```

El primer comando muestra cambios no preparados. El segundo muestra exactamente lo que entrará en el próximo commit. Esa diferencia evita que una corrección accidental viaje escondida.

## Commits que ayudan

Un commit útil responde a una pregunta concreta: “¿qué cambió y por qué?”. Prefiere varios cambios pequeños que uno enorme. Un mensaje como `fix: handle empty config` comunica intención; `changes` no.

:::tip Regla de reversibilidad
Si no puedes explicar cómo deshacer un commit, probablemente contiene más de una decisión.
:::

## Remotos y confianza

Un remoto es una referencia a otra copia del repositorio. `fetch` trae información; `pull` combina esa información con tu rama local. Separar ambos pasos hace visible cuándo estás leyendo y cuándo estás integrando.

```bash
git fetch origin
git log --oneline HEAD..origin/main
```
