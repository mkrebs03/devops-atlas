# DevOps Atlas

Referencia de DevOps para quien ya programa: conceptos que construyen un modelo mental, herramientas documentadas de la A a la Z, un glosario y prácticas que ejecutas en tu propia máquina. Sitio estático bilingüe (español / inglés) construido con [Astro](https://astro.build) y [Starlight](https://starlight.astro.build).

> **English** — DevOps Atlas is a DevOps reference for developers who already code: concepts that build a mental model, an A–Z of tools, a glossary, and walkthroughs you run on your own machine. It is a bilingual static site (Spanish / English) built with Astro + Starlight.

---

## ✨ Características

- **Referencia estructurada** — 8 módulos, 36 páginas (5 de ellas prácticas ejecutables), índice A–Z de herramientas y glosario.
- **Bilingüe de origen** — español e inglés son pares; ninguno es una traducción secundaria.
- **Sin estado del lector** — no hay cuentas ni progreso; lo único que se guarda en el navegador es la preferencia de tema, bajo la clave `starlight-theme` de Starlight.
- **Diagramas interactivos** — bloques Mermaid renderizados en el cliente.
- **Accesible** — WCAG-AA, texto mínimo de 14 px, mejora progresiva.
- **Contenerizable** — Dockerfile multi-stage con nginx para producción.

## 🗺️ Módulos

Los módulos se agrupan por el estado del sistema que describen —una máquina, un paquete, una comprobación automática—, así que el orden explica por qué aparece cada herramienta. No son niveles del lector: `level` es un campo por página.

| #  | Módulo                 | Herramientas                       | Práctica                        |
|----|------------------------|------------------------------------|---------------------------------|
| 01 | Fundamentos            | Linux, Bash, curl, ss              | Investigar una aplicación local |
| 02 | Colaboración           | Git, GitHub                        | Ramas seguras                   |
| 03 | Un servidor            | SSH, ufw, systemd, nginx, Certbot  | De VPS vacía a HTTPS            |
| 04 | Contenedores           | Docker, Docker Compose, nginx      | Pipeline local                  |
| 05 | Pruebas                | Node.js                            | Tu primera prueba               |
| 06 | Integración continua   | GitHub Actions, YAML, Git, GitHub  | —                               |
| 07 | Despliegue continuo    | nginx, Traefik, Docker             | Promover y revertir             |
| 08 | Escalar                | Prometheus, PostgreSQL, Kubernetes | —                               |

## 📋 Requisitos

- **Node.js** ≥ 20.11 (ver [`.node-version`](.node-version))
- **pnpm** 10.29.3 (gestionado vía `corepack`)

```bash
corepack enable
corepack prepare pnpm@10.29.3 --activate
```

## 🚀 Inicio rápido

```bash
# Clonar el repositorio
git clone https://github.com/mkrebs/devops-atlas.git
cd devops-atlas

# Instalar dependencias
pnpm install --frozen-lockfile

# Servidor de desarrollo → http://localhost:4321
pnpm dev
```

## 🛠️ Scripts disponibles

| Comando                      | Descripción                                                    |
|------------------------------|----------------------------------------------------------------|
| `pnpm dev`                   | Inicia el servidor de desarrollo en `localhost:4321`            |
| `pnpm run build`             | Ejecuta validaciones y genera el sitio estático en `dist/`     |
| `pnpm run check`             | Comprobaciones de Astro y TypeScript                           |
| `pnpm run validate:content`  | Valida frontmatter, paridad ES/EN y slugs únicos del contenido |
| `pnpm preview`               | Sirve el build de producción localmente                        |
| `pnpm run test:e2e`          | Ejecuta smoke tests con Playwright (Chromium)                  |
| `pnpm run test:e2e:ui`       | Abre la interfaz visual de Playwright                          |

## 🐳 Docker

Build multi-stage que compila el sitio y lo sirve con nginx:

```bash
# Construir la imagen
docker build -t devops-atlas .

# Ejecutar en local
docker run -p 8080:80 devops-atlas
```

El procedimiento de producción completo vive en [`deploy/README.md`](deploy/README.md): el Compose de `deploy/docker-compose.prod.yml` requiere `--env-file` con `ATLAS_IMAGE` definido y la red externa `caddy-net` ya creada. Ahí están también el contrato de secrets del workflow y el procedimiento de rollback.

## 📁 Estructura del proyecto

```
devops-atlas/
├── src/
│   ├── components/         # AtlasLanding, ToolsIndex, RelatedLinks y starlight/Atlas* (Header, Footer, PageTitle, TableOfContents, TocList, MermaidRunner)
│   ├── content/
│   │   ├── docs/           # Contenido en español
│   │   │   ├── index.mdx   # Landing
│   │   │   ├── what-is-devops.md
│   │   │   ├── tools.mdx   # Índice A–Z
│   │   │   ├── glossary.md
│   │   │   ├── 404.md
│   │   │   ├── foundations/
│   │   │   ├── collaboration/
│   │   │   ├── server/
│   │   │   ├── containers/
│   │   │   ├── testing/
│   │   │   ├── integration/
│   │   │   ├── deployment/
│   │   │   └── scaling/
│   │   ├── docs/en/        # Contenido en inglés (misma estructura)
│   │   └── i18n/           # Traducciones de la interfaz
│   ├── data/               # Taxonomía (curriculum.mjs), nombres de herramientas y textos de UI
│   ├── fonts/              # Tipografías auto-alojadas (OFL)
│   ├── lib/                # Índice de herramientas y utilidades
│   └── styles/             # Tokens CSS, layout y estilos del sitio
├── plugins/                # Plugins rehype (cuerpo de <details>, envoltura de tablas)
├── public/                 # Estáticos sin procesar (favicon)
├── scripts/                # Validación de contenido y frontmatter
├── tests/                  # Tests E2E con Playwright
├── deploy/                 # nginx.conf, Docker Compose y contrato de despliegue
├── .github/workflows/      # CI: validación y despliegue
├── Dockerfile              # Build multi-stage (Node → nginx)
└── astro.config.mjs        # Configuración de Astro + Starlight
```

## 🧪 Tests

Los smoke tests E2E usan [Playwright](https://playwright.dev) con Chromium:

```bash
# Instalar el navegador (solo la primera vez)
pnpm exec playwright install --with-deps chromium

# Ejecutar tests
pnpm run test:e2e
```

## 🔄 CI/CD

El repositorio incluye dos workflows de GitHub Actions:

- **Validate** (`validate.yml`) — se ejecuta en cada PR y push a `main`: instala dependencias, compila el sitio, valida contenido y ejecuta smoke tests.
- **Deploy** (`deploy.yml`) — compila, ejecuta los smoke tests, publica la imagen en GHCR y despliega al VPS, con rollback automático si el health check falla (ver [`deploy/README.md`](deploy/README.md)).

## 📝 Convenciones de contenido

Toda página Markdown requiere `title` y `description`. Las páginas de módulo llevan además la taxonomía completa:

```yaml
---
title: Título de la página
description: Descripción breve
type: concept   # concept | tool | practice | cheatsheet
level: beginner # beginner | intermediate | advanced
module: foundations
---
```

junto con `tools`, `prerequisites`, `learningObjectives` y `takeaways`. Los conteos de objectives y takeaways deben coincidir entre las versiones en español e inglés, y `level` y `tools` deben ser idénticos en ambas.

Convenciones de redacción:

- Los anglicismos llevan género fijo: «el pipeline», «el build».
- En prosa se escribe «prueba»; «test» se reserva para nombres literales (jobs, comandos, `npm test`).
- Las preguntas de los `<summary>` de autoevaluación en español abren con «¿» — lo valida el CI.

## 🤝 Contribuir

1. Crea una rama desde `main` con nombre descriptivo.
2. Sigue los commits convencionales: `feat:`, `fix:`, `docs:`.
3. Ejecuta `pnpm run build` y `pnpm run test:e2e` antes de abrir el PR.
4. Incluye capturas para cambios visuales.
5. Nunca subas credenciales ni archivos `.env` de producción.

## 🌐 Variables de entorno

```bash
# .env (ver .env.example)
PUBLIC_SITE_URL=https://devops.lazycat.app
```

## 📄 Licencia

Proyecto personal / portafolio.
