---
title: Lab · ramas seguras
description: Practica una rama pequeña, revisa su diff y vuelve atrás sin perder el trabajo.
type: lab
level: beginner
module: collaboration
tools: [git]
estimatedTime: 25 minutos
prerequisites: [collaboration.git-model]
learningObjectives:
  - Crear un cambio aislado en una rama y revisar su diff antes de integrarlo.
  - Practicar una forma segura de deshacer el cambio sin perder trabajo.
takeaways:
  - Revisar el grafo y el diff antes de integrar hace visible el alcance real.
  - Git permite volver atrás con operaciones explícitas y verificables.
---

## Objetivo

Crearás un repositorio temporal, harás un cambio en una rama y comprobarás cómo se ve la historia antes de integrarla.

## Paso 1 · prepara el mapa

```bash
mkdir -p /tmp/atlas-git-lab
cd /tmp/atlas-git-lab
git init --initial-branch=main
printf '# Atlas lab\n' > README.md
git add README.md
git commit -m 'docs: start atlas lab'
```

## Paso 2 · crea una intención aislada

```bash
git switch -c feat/add-signal
printf '\nStatus: learning\n' >> README.md
git diff
git add README.md
git commit -m 'docs: add learning signal'
```

Observa que el commit solo contiene el cambio que querías explicar.

## Paso 3 · integra y verifica

```bash
git switch main
git merge --ff-only feat/add-signal
git log --oneline --graph --decorate --all
```

## Verificación

El historial debe mostrar dos commits y `README.md` debe incluir `Status: learning`. Para practicar rollback sin borrar la rama:

```bash
git revert HEAD
git log --oneline --graph --decorate --all
```

:::tip Revertir también es una entrega
`git revert` crea una nueva decisión que deshace otra. Es preferible a reescribir historia compartida.
:::

## Limpieza

```bash
rm -rf /tmp/atlas-git-lab
```
