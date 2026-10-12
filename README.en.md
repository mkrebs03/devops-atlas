# DevOps Atlas

[![CI](https://github.com/mkrebs03/devops-atlas/actions/workflows/validate.yml/badge.svg)](https://github.com/mkrebs03/devops-atlas/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Español](README.md) · **English**

My DevOps notes, organized as a reference in Spanish and English. I put them together as I learn: some of what is here I run every day and some I have only studied. The [About this site](https://devops.mkrebs.tech/en/about/) page says which is which.

[![DevOps Atlas landing page](.github/media/landing-en.png)](https://devops.mkrebs.tech/en/)

**[devops.mkrebs.tech/en](https://devops.mkrebs.tech/en/)**

## Who writes it

Martín Sanhueza Krebs, a computer engineering student at Universidad de La Frontera. The pages assume the reader already writes code.

## What is inside

Eight modules grouped by the state of the system they describe — one machine, one package, one automated check — plus an A–Z tool index and a glossary. The order suggests a reading path; you can also come in through search or the index.

| #  | Module                  | Tools                                                           | Practice                           |
|----|-------------------------|-----------------------------------------------------------------|------------------------------------|
| 01 | Foundations             | Linux, Bash, curl, ss                                           | Investigate a local application    |
| 02 | Collaboration           | Git, GitHub                                                     | Safe branches                      |
| 03 | One server              | SSH, ufw, systemd, nginx, Certbot                               | From empty VPS to HTTPS            |
| 04 | Containers              | Docker, Docker Compose, nginx                                   | Packaging myapp                    |
| 05 | Continuous integration  | GitHub Actions, YAML, Node.js, Git, GitHub                      | A test and a workflow              |
| 06 | Continuous deployment   | GitHub Actions, Docker, Docker Compose, nginx, Traefik          | Promote and roll back              |
| 07 | Operating and scaling   | Prometheus, OpenTelemetry, PostgreSQL, Kubernetes, Docker Swarm | —                                  |
| 08 | Infrastructure as code  | Terraform, Ansible, SSH                                         | —                                  |

The walkthroughs work on the same sample application, so each one starts where the previous one ended. They are written walkthroughs: I have not run them end to end and the output they show is illustrative.

## How it is built

A static site built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), with no backend: the only thing it writes to the browser is the theme preference (`starlight-theme`). Diagrams are authored as Mermaid blocks and rendered client-side. CI fails the build if a page loses its counterpart in the other language.

## Running it locally

You need Node.js ≥ 20.11 (see [`.node-version`](.node-version)) and pnpm via Corepack:

```bash
corepack enable
corepack prepare pnpm@10.29.3 --activate
```

```bash
git clone https://github.com/mkrebs03/devops-atlas.git
cd devops-atlas
pnpm install --frozen-lockfile
pnpm dev          # http://localhost:4321
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on `localhost:4321` |
| `pnpm run build` | Validates content and builds the site into `dist/` |
| `pnpm preview` | Serves the production build |
| `pnpm run test:e2e` | Playwright smoke tests (Chromium) |

## Docker

```bash
docker build -t devops-atlas .
docker run -p 8080:80 devops-atlas
```

Multi-stage build: compiles with Node, serves the result with nginx. The production procedure — Compose, workflow secrets, and rollback — lives in [`deploy/README.md`](deploy/README.md).

## Status

There are eight modules, from booting a machine to describing that machine in a file, with backups, observability, and secrets along the way. I have not written yet about public clouds, security, or Kubernetes beyond an introduction.

## Contributing

Issues are open for corrections, questions, and suggestions, and PRs from any fork are welcome. Merging to `main` is at the maintainer's discretion after review: opening a PR is no guarantee it lands. Content conventions and the steps are in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE) — Martín Sanhueza Krebs ([@mkrebs03](https://github.com/mkrebs03)).
