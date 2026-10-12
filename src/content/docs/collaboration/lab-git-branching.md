---
title: Práctica · ramas seguras
description: Versiona la aplicación de ejemplo, resuelve un conflicto, deshaz un merge y abre tu primer pull request.
type: practice
level: beginner
module: collaboration
tools: [git, github]
prerequisites: [collaboration.git-model]
learningObjectives:
  - Crear un cambio aislado en una rama y revisar su diff antes de integrarlo.
  - Resolver un conflicto de merge simple de forma deliberada.
  - Deshacer un cambio integrado sin reescribir la historia.
  - Publicar una rama y proponerla como pull request.
takeaways:
  - Revisar el grafo y el diff antes de integrar hace visible el alcance real.
  - Un conflicto es una decisión que Git te delega, no un error.
  - Revertir crea una decisión nueva; no borra la anterior.
  - Una rama publicada y un pull request convierten tu cambio en algo que otra persona puede revisar.
---

## Qué vas a tener al final

`miapp` dentro de un repositorio con una historia legible —un merge, un conflicto resuelto y un revert—, publicado en GitHub y con un pull request integrado. Ese repositorio remoto es el que usan las prácticas de servidor y de integración continua.

## Requisitos

- Git configurado con tu nombre y tu correo.
- La carpeta `~/miapp` de la [práctica anterior](/foundations/lab-shell-and-network/). Si no la tienes, créala con el `server.js` de [La aplicación de ejemplo](/sample-app/#el-archivo).
- Una cuenta de GitHub, para los pasos 5 y 6.
- Unos 25 minutos.

## Paso 1 · El primer commit

```bash
cd ~/miapp
git init --initial-branch=main
printf 'node_modules/\n.env\n' > .gitignore
git add server.js .gitignore
git commit -m 'feat: add miapp server'
```

**Señal:** `git status` responde que no hay nada que confirmar, y `git log --oneline` muestra un commit.

## Paso 2 · Una intención aislada

```bash
git switch -c docs/readme
printf '# miapp\n\nServidor HTTP mínimo. Arranca con `node server.js`.\n' > README.md
git add README.md
git diff --cached              # exactamente lo que va a entrar en el commit
git commit -m 'docs: add readme'
git switch main
git merge --ff-only docs/readme
```

**Señal:** el merge responde `Fast-forward`. `main` no había avanzado, así que Git solo movió la referencia: no hay commit de merge porque no había dos líneas que unir.

## Paso 3 · Provoca y resuelve un conflicto

Haz que dos ramas cambien la misma línea:

```bash
printf 'PORT=8080\n' > .env.example
git add .env.example           # archivo nuevo: -a no lo incluiría
git commit -m 'chore: document PORT in env example'

git switch -c chore/port-3000
printf 'PORT=3000\n' > .env.example
git commit -am 'chore: default port 3000'

git switch main
printf 'PORT=8081\n' > .env.example
git commit -am 'chore: default port 8081'

git merge chore/port-3000      # CONFLICT en .env.example
```

Abre `.env.example`. Git dejó las dos versiones entre marcas:

```text
<<<<<<< HEAD
PORT=8081
=======
PORT=3000
>>>>>>> chore/port-3000
```

Edítalo hasta dejar una sola línea —por ejemplo `PORT=3000`—, sin marcas, y cierra el merge:

```bash
git add .env.example
git commit --no-edit
```

**Señal:** `git log --oneline --graph` dibuja dos líneas que se separan y vuelven a unirse en un commit `Merge branch 'chore/port-3000'`.

## Paso 4 · Deshacer sin reescribir

Supón que ese merge fue un error. No lo borres: decláralo.

```bash
git revert -m 1 --no-edit HEAD
git log --oneline --graph
cat .env.example
```

`-m 1` le dice a Git qué lado del merge conservar: el primero, que es la línea de `main`. `--no-edit` acepta el mensaje propuesto en vez de abrir un editor.

**Señal:** hay un commit nuevo `Revert "Merge branch 'chore/port-3000'"`, el merge sigue visible debajo, y el archivo vuelve a decir `PORT=8081`.

:::tip[Revertir también es una entrega]
`git revert` crea una nueva decisión que deshace otra. Es preferible a reescribir historia compartida con `reset --hard`, porque quien ya tenía esos commits no se queda con una historia distinta de la tuya.
:::

## Paso 5 · Publícalo

Crea en GitHub un repositorio vacío llamado `miapp` —sin README ni licencia, para que no tenga historia propia— y conéctalo:

```bash
git remote add origin git@github.com:TU_USUARIO/miapp.git
git push -u origin main
```

`-u` deja asociada tu rama local con la remota, así que los próximos `git push` y `git pull` no necesitan argumentos.

**Señal:** la página del repositorio muestra `server.js`, y `git status` dice que tu rama está al día con `origin/main`.

## Paso 6 · Tu primer pull request

```bash
git switch -c docs/routes
printf '\n## Rutas\n\n- `/` devuelve la versión.\n- `/health` devuelve el estado.\n' >> README.md
git commit -am 'docs: list routes'
git push -u origin docs/routes
```

La salida del `push` incluye un enlace para abrir el pull request. Ábrelo, escribe qué cambia y cómo lo comprobaste, e intégralo desde la web. Después trae el resultado:

```bash
git switch main
git pull --ff-only
git branch -d docs/routes
```

**Señal:** `git log --oneline` en `main` incluye el cambio del README, y `git branch -d` borra la rama sin protestar porque ya está integrada.

## Si algo no cuadra

| Síntoma | Qué pasó | Qué hacer |
| --- | --- | --- |
| `git commit` dice que hay rutas sin fusionar | Falta marcar el conflicto como resuelto | `git add .env.example` |
| El merge quedó a medias y quieres empezar de nuevo | Sigues dentro del merge | `git merge --abort` |
| `push` rechazado con `Permission denied (publickey)` | GitHub no conoce tu clave SSH | Añádela en tu cuenta, o usa la URL `https://` del repositorio |
| `push` rechazado con `fetch first` | El remoto tiene commits que tú no | Lo creaste con README: `git pull --rebase origin main` |

## Comprueba lo que entendiste

<details>
<summary>Resolviste el conflicto pero olvidaste git add del archivo. ¿Puedes cerrar el merge?</summary>

No: mientras el archivo siga marcado como no resuelto, Git no te deja completar el merge. Haz `git add .env.example` para marcarlo como resuelto y luego `git commit` para cerrar la integración.

</details>

<details>
<summary>¿Por qué el merge del paso 2 no creó un commit y el del paso 3 sí?</summary>

Porque en el paso 2 `main` no se había movido desde que nació la rama: bastaba adelantar la referencia. En el paso 3 las dos ramas tenían commits propios, así que hacía falta un commit con dos padres que las uniera.

</details>

## Limpieza

Las ramas locales ya integradas se pueden borrar:

```bash
git branch -d docs/readme chore/port-3000
```

**Conserva `~/miapp` y el repositorio en GitHub**: el resto de las prácticas siguen desde ahí.
