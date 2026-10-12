# Contribuir a DevOps Atlas

*[English below](#contributing-to-devops-atlas)*

Los issues están abiertos para bugs, dudas y sugerencias. Se aceptan PRs desde cualquier fork, pero el merge a `main` queda a criterio del mantenedor tras revisión: abrir un PR no garantiza que se fusione.

## Flujo de trabajo

1. Crea una rama desde `main` con nombre descriptivo.
2. Usa commits convencionales: `feat:`, `fix:`, `docs:`.
3. Ejecuta `pnpm run build` y `pnpm run test:e2e` antes de abrir el PR.
4. Incluye capturas para cambios visuales.
5. Nunca subas credenciales ni archivos `.env` de producción.

## Paridad español / inglés

Es una restricción dura, no una aspiración. Todo archivo bajo `src/content/docs/` necesita su contraparte en `src/content/docs/en/` y viceversa —páginas sueltas incluidas— o el build falla. Starlight rellenaría silenciosamente la ruta inglesa con contenido español, así que la validación empareja los archivos ella misma.

Además, entre cada par canónico:

- `tools` debe ser idéntico **y en el mismo orden**.

La validación compara archivos y frontmatter, no equivalencia de prosa: que pase el CI no significa que la traducción esté completa.

## Frontmatter

Toda página Markdown requiere `title` y `description`. Las páginas dentro de un directorio de módulo requieren además `type` y `module`:

```yaml
---
title: Título de la página
description: Descripción breve
type: concept   # concept | tool | practice | cheatsheet
module: foundations
---
```

Las páginas declaradas en `src/data/curriculum.mjs` requieren también los arrays `tools` y `prerequisites`.

Toda página de módulo debe estar declarada en `curriculum.mjs`, y cada slug de `tools` debe tener nombre visible en `src/data/tool-names.mjs` —si no, el índice A–Z imprimiría el slug crudo—. Los slugs de contenido son únicos en todo el sitio.

Todo esto lo aplica `scripts/validate-content.mjs`, que corre dentro de `pnpm run build`.

## Convenciones de redacción

- Los anglicismos llevan género fijo: «el pipeline», «el build».
- En prosa se escribe «prueba»; «test» se reserva para nombres literales (jobs, comandos, `npm test`).
- Las preguntas en un `<summary>` en español abren con «¿». El CI rechaza cualquier `<summary>` que termine en `?` sin `¿` en archivos fuera de `en/`.
- Los módulos se agrupan por el estado del sistema que describen, nunca por nivel del lector.

## Estructura del proyecto

```
devops-atlas/
├── src/
│   ├── components/         # AtlasLanding, ToolsIndex, RelatedLinks y starlight/Atlas*
│   ├── content/
│   │   ├── docs/           # Contenido en español (9 directorios de módulo + páginas sueltas)
│   │   ├── docs/en/        # Contenido en inglés (misma estructura)
│   │   └── i18n/           # Traducciones de la interfaz
│   ├── data/               # curriculum.mjs (taxonomía), tool-names.mjs, textos de UI
│   ├── fonts/              # Tipografías auto-alojadas (OFL)
│   ├── lib/                # Índice de herramientas y utilidades
│   └── styles/             # tokens.css (identidad visual), layout y estilos
├── plugins/                # Plugins rehype
├── scripts/                # Validación de contenido y frontmatter
├── tests/                  # Smoke tests con Playwright
├── deploy/                 # nginx.conf, Compose de producción y contrato de despliegue
├── .github/workflows/      # validate.yml (PRs y push a main), deploy.yml
├── Dockerfile              # Build multi-stage (Node → nginx)
└── astro.config.mjs        # Configuración de Astro + Starlight
```

La identidad visual está comprometida y documentada en `DESIGN.md`; el propósito y las restricciones del producto, en `PRODUCT.md`. Vale la pena leerlos antes de proponer cambios de diseño o de alcance.

---

# Contributing to DevOps Atlas

Issues are open for bugs, questions, and suggestions. PRs from any fork are welcome, but merging to `main` is at the maintainer's discretion after review: opening a PR is no guarantee it lands.

## Workflow

1. Branch off `main` with a descriptive name.
2. Use conventional commits: `feat:`, `fix:`, `docs:`.
3. Run `pnpm run build` and `pnpm run test:e2e` before opening the PR.
4. Include screenshots for visual changes.
5. Never commit credentials or production `.env` files.

## Spanish / English parity

This is a hard constraint, not an aspiration. Every file under `src/content/docs/` needs its counterpart in `src/content/docs/en/` and vice versa — standalone pages included — or the build fails. Starlight would quietly fill the English route with Spanish content, so validation pairs the files itself.

Between each canonical pair:

- `tools` must be identical **and in the same order**.

Validation compares files and frontmatter, not prose equivalence: passing CI does not mean the translation is complete.

## Frontmatter

Every Markdown page requires `title` and `description`. Pages inside a module directory also require `type` and `module`:

```yaml
---
title: Page title
description: Short description
type: concept   # concept | tool | practice | cheatsheet
module: foundations
---
```

Pages declared in `src/data/curriculum.mjs` additionally require the `tools` and `prerequisites` arrays.

Every module page must be declared in `curriculum.mjs`, and every `tools` slug must have a display name in `src/data/tool-names.mjs` — otherwise the A–Z index would print the raw slug. Content slugs are unique across the site.

All of this is enforced by `scripts/validate-content.mjs`, which runs as part of `pnpm run build`.

## Writing conventions

- Spanish pages give English loanwords a fixed gender: «el pipeline», «el build».
- Spanish prose uses «prueba»; «test» is reserved for literal names (jobs, commands, `npm test`).
- Spanish `<summary>` questions open with «¿». CI rejects any `<summary>` ending in `?` without a `¿` outside `en/`.
- Modules are grouped by the state of the system they describe, never by reader level.

## Project layout

See the tree in the Spanish section above. `DESIGN.md` documents the committed visual identity; `PRODUCT.md` documents the product's purpose and constraints. Both are worth reading before proposing design or scope changes.
