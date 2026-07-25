# DevOps Atlas

Atlas de aprendizaje guiado que lleva a un desarrollador desde los fundamentos hasta competencia operativa en DevOps. Sitio estático bilingüe (español / inglés) construido con [Astro](https://astro.build) y [Starlight](https://starlight.astro.build).

> **English** — DevOps Atlas is a guided learning atlas that takes a developer from the basics to working DevOps competence. It is a bilingual static site (Spanish / English) built with Astro + Starlight.

---

## ✨ Características

- **Referencia estructurada** — 5 módulos, 20 páginas y 5 prácticas ejecutables, con índice A–Z de herramientas.
- **Bilingüe de origen** — español e inglés son pares; ninguno es una traducción secundaria.
- **Sin estado** — no hay cuentas, ni progreso, ni `localStorage`: solo contenido y navegación.
- **Diagramas interactivos** — bloques Mermaid renderizados en el cliente.
- **Accesible** — WCAG-AA, texto mínimo de 14 px, mejora progresiva.
- **Contenerizable** — Dockerfile multi-stage con nginx para producción.

## 🗺️ Módulos

| #  | Módulo          | Herramientas                    | Práctica                   |
|----|-----------------|--------------------------------|----------------------------|
| 01 | Fundamentos     | Linux, Bash, curl, ss          | Shell y red                |
| 02 | Colaboración    | Git, GitHub Flow               | Ramas seguras              |
| 03 | Entrega         | Docker, GitHub Actions, nginx  | Pipeline local             |
| 04 | Pruebas         | Node.js, node:test, CI         | Tu primera prueba          |
| 05 | Despliegue      | Docker, nginx, blue-green      | Promover y revertir        |

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
| `pnpm run validate:content`  | Valida frontmatter y slugs únicos del contenido                |
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

Para producción con Docker Compose:

```bash
docker compose -f deploy/docker-compose.prod.yml up -d
```

## 📁 Estructura del proyecto

```
devops-atlas/
├── src/
│   ├── components/         # Componentes Astro (Header, Footer, PageTitle)
│   ├── content/
│   │   ├── docs/           # Contenido en español
│   │   │   ├── foundations/
│   │   │   ├── collaboration/
│   │   │   ├── delivery/
│   │   │   ├── testing/
│   │   │   └── deployment/
│   │   ├── docs/en/        # Contenido en inglés (misma estructura)
│   │   └── i18n/           # Traducciones de la interfaz
│   ├── data/               # Taxonomía de contenido (curriculum.mjs)
│   ├── fonts/              # Tipografías auto-alojadas (OFL)
│   ├── lib/                # Índice de herramientas y utilidades
│   ├── scripts/            # Scripts del cliente
│   └── styles/             # Tokens CSS, layout y estilos del sitio
├── scripts/                # Validación de contenido y frontmatter
├── tests/                  # Tests E2E con Playwright
├── deploy/                 # nginx.conf y Docker Compose de producción
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
- **Deploy** (`deploy.yml`) — despliega el sitio a producción.

## 📝 Convenciones de contenido

Cada página Markdown requiere frontmatter obligatorio:

```yaml
---
title: Título de la página
description: Descripción breve
type: concept   # concept | tool | practice | cheatsheet
level: beginner # beginner | intermediate
module: foundations
---
```

Las páginas de módulo requieren además: `tools`, `prerequisites`, `learningObjectives` y `takeaways`. Los conteos de objectives y takeaways deben coincidir entre las versiones en español e inglés.

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
