---
title: Lab · ramas seguras
description: Practica una rama pequeña, revisa su diff, resuelve un conflicto y vuelve atrás sin perder el trabajo.
type: lab
level: beginner
module: collaboration
tools: [git]
estimatedTime: 25 minutos
prerequisites: [collaboration.git-model]
learningObjectives:
  - Crear un cambio aislado en una rama y revisar su diff antes de integrarlo.
  - Resolver un conflicto de merge simple de forma deliberada.
  - Practicar una forma segura de deshacer un cambio sin perder trabajo.
takeaways:
  - Revisar el grafo y el diff antes de integrar hace visible el alcance real.
  - Un conflicto es una decisión que Git te delega, no un error.
  - Git permite volver atrás con operaciones explícitas y verificables.
---

## Objetivo

Crearás un repositorio temporal, harás un cambio en una rama, provocarás y resolverás un conflicto, y comprobarás cómo se ve la historia antes de confiar en ella.

## Paso 1 · prepara el mapa

```bash
mkdir -p /tmp/atlas-git-lab
cd /tmp/atlas-git-lab
git init --initial-branch=main
printf '# Atlas lab\n' > README.md
git add README.md
git commit -m 'docs: start atlas lab'
```

## Paso 2 · una intención aislada

```bash
git switch -c feat/add-signal
printf '\nStatus: learning\n' >> README.md
git diff                       # revisa el cambio antes de guardarlo
git commit -am 'docs: add learning signal'
git switch main
git merge --ff-only feat/add-signal
```

El commit contiene solo el cambio que querías explicar, y el merge lineal deja una historia limpia.

## Paso 3 · provoca y resuelve un conflicto

Haz que dos ramas cambien la misma línea:

```bash
printf 'timeout = 45\n' > config.txt
git commit -am 'chore: add config with timeout 45'
git switch -c feat/timeout
printf 'timeout = 60\n' > config.txt
git commit -am 'chore: raise timeout to 60'
git switch main
printf 'timeout = 30\n' > config.txt
git commit -am 'chore: lower timeout to 30'
git merge feat/timeout          # CONFLICT en config.txt
```

Abre `config.txt`: Git dejó ambas versiones entre las marcas `<<<<<<<`, `=======` y `>>>>>>>`. Elige el valor correcto, borra las marcas y cierra el merge:

```bash
# edita config.txt hasta dejar una sola línea (por ejemplo, timeout = 60)
git add config.txt
git commit --no-edit
```

Resolver el conflicto es tomar la decisión que Git no puede tomar por ti.

## Paso 4 · deshacer con seguridad

```bash
git revert HEAD                 # crea un commit que deshace el anterior
git log --oneline --graph --decorate --all
```

:::tip Revertir también es una entrega
`git revert` crea una nueva decisión que deshace otra. Es preferible a reescribir historia compartida con `reset --hard`.
:::

## Verificación

El historial debe mostrar los merges y el revert como commits explícitos, y `git status` debe estar limpio. La afirmación comprobable es: cada cambio quedó registrado como una decisión que puedes leer y deshacer.

## Comprueba lo que entendiste

<details>
<summary>Resolviste el conflicto pero olvidaste git add del archivo. Puedes cerrar el merge?</summary>

No: mientras el archivo siga marcado como no resuelto, Git no te deja completar el merge. Haz `git add config.txt` para marcarlo como resuelto y luego `git commit` para cerrar la integración.

</details>

## Limpieza

```bash
rm -rf /tmp/atlas-git-lab
```
