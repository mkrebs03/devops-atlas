---
title: Sobre este sitio
description: Quién escribe DevOps Atlas, qué de todo esto opero y qué solo he estudiado.
---

DevOps Atlas son mis apuntes de DevOps, ordenados por tema para poder consultarlos. Los publico para compartir lo que voy aprendiendo y para que me quede un registro.

## Quién escribe

Soy Martín Sanhueza Krebs. Actualmente curso cuarto año de Ingeniería Informática en la Universidad de La Frontera, en Temuco, Chile. Mi GitHub es [@mkrebs03](https://github.com/mkrebs03).

Llegué a esto como DevOps trainee en un grupo de la universidad, en reemplazo del estudiante que estaba a cargo y que se iba a titular. Empecé con un solo sistema y con el tiempo fui tomando más proyectos.

## Qué opero hoy

- Un cluster k3s que comparten dos grupos de la universidad. Su estado se define en un repositorio y Argo CD lo aplica. Entre los sistemas que mantengo hay uno con usuarios reales.
- Un proyecto de investigación entre dos universidades, donde trabajo como DevOps y en frontend.
- Este sitio, que corre en una VPS mía.

## Qué uso y qué no

Lo opero en sistemas reales:

- Linux, SSH y la terminal
- Git y pull requests
- Docker y Docker Compose
- nginx, Caddy y Traefik
- TLS con certbot
- ufw
- GitHub Actions
- Secretos cifrados en el repositorio
- PostgreSQL
- Respaldos fuera de la máquina, con restauraciones probadas
- Observabilidad con Grafana, Loki, Prometheus y Alertmanager
- Kubernetes, con k3s y Argo CD

Lo usé en un proyecto o en una prueba, pero no lo mantengo:

- Units de systemd y tareas de cron
- Redis
- OpenTelemetry
- Despliegue manual por SSH a una VPS

Solo lo he estudiado:

- Terraform
- Ansible
- Docker Swarm
- Balanceo de carga entre varias instancias, blue-green y canary

En nubes públicas y en infraestructura como código tengo poca experiencia. Las páginas de los temas que solo he estudiado llevan una nota al inicio que lo dice.

Kubernetes es lo que más opero y lo que menos he escrito aquí: por ahora el sitio solo tiene una [introducción a la orquestación](/scaling/orchestration/).

## Cómo está escrito

Escribí el sitio con ayuda de IA, siguiendo un roadmap propio. Las prácticas sobre la [aplicación de ejemplo](/sample-app/) son recorridos escritos: no las ejecuté de punta a punta y la salida que muestran es ilustrativa.

## Correcciones

Si encuentras un error, [abre un issue en GitHub](https://github.com/mkrebs03/devops-atlas/issues).
