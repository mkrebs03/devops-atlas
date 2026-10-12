---
title: About this site
description: Who writes DevOps Atlas, which of these topics I run and which I have only studied.
---

DevOps Atlas is my DevOps notes, arranged by topic so they can be looked up. I publish them to share what I am learning and to keep a record of it.

## Who writes it

I'm Martín Sanhueza Krebs. I am currently in the fourth year of a computer engineering degree at Universidad de La Frontera, in Temuco, Chile. My GitHub is [@mkrebs03](https://github.com/mkrebs03).

I got into this as a DevOps trainee in a university group, replacing the student who was in charge and was about to graduate. I started with a single system and took on more projects over time.

## What I run today

- A k3s cluster shared by two university groups. Its state is defined in a repository and Argo CD applies it. One of the systems I maintain has real users.
- A research project between two universities, where I work as DevOps and on the frontend.
- This site, which runs on a VPS of mine.

## What I use and what I do not

I run these on real systems:

- Linux, SSH and the terminal
- Git and pull requests
- Docker and Docker Compose
- nginx, Caddy and Traefik
- TLS with certbot
- ufw
- GitHub Actions
- Secrets encrypted in the repository
- PostgreSQL
- Off-machine backups, with tested restores
- Observability with Grafana, Loki, Prometheus and Alertmanager
- Kubernetes, with k3s and Argo CD

I used these in a project or a trial, but I do not maintain them:

- systemd units and cron jobs
- Redis
- OpenTelemetry
- Manual deployment over SSH to a VPS

I have only studied these:

- Terraform
- Ansible
- Docker Swarm
- Load balancing across several instances, blue-green and canary

I have little experience with public clouds and with infrastructure as code. Pages on topics I have only studied carry a note at the top that says so.

Kubernetes is what I run the most and what I have written about the least here: for now the site only has an [introduction to orchestration](/en/scaling/orchestration/).

## How it is written

I wrote the site with the help of AI, following a roadmap of my own. The walkthroughs on the [sample application](/en/sample-app/) are written walkthroughs: I have not run them end to end and the output they show is illustrative.

## Corrections

If you find an error, [open an issue on GitHub](https://github.com/mkrebs03/devops-atlas/issues).
