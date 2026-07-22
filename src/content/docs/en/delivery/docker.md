---
title: Docker without magic
description: Understand images, containers, networks and volumes through their contracts.
type: tool
level: beginner
module: delivery
tools: [docker, containers, nginx]
estimatedTime: 40 minutes
prerequisites: [foundations.linux-cli, foundations.networking]
learningObjectives:
  - Distinguish an immutable image from a running container.
  - Define the process, port, configuration, and data contract of a container.
takeaways:
  - An image packages layers while a container runs a process under concrete conditions.
  - Ports, volumes, and configuration should form an observable contract.
---

## An image and a container are not synonyms

An **image** is an immutable package of layers. A **container** is a process created from that image with a concrete runtime environment.

```bash
docker build -t atlas-web:local .
docker run --rm -p 8080:80 atlas-web:local
```

The tag helps you find an image; it does not make `latest` a reliable version. In production, use an immutable identifier such as a SHA.

## The container contract

Before running an image, define:

- Which process starts.
- Which port it listens on.
- Which configuration it receives.
- Which data must survive the process.
- How its health is verified.

For a static application, the container can be minimal: a web server that reads files and stores no state.

## Networks and names

On a Docker network, services can find one another by name. You do not need to publish every port to the host. If Caddy and an application share an external network, Caddy can route internally to the service name.

```yaml
services:
  atlas:
    image: ghcr.io/example/devops-atlas:sha-abc123
    networks: [caddy-net]

networks:
  caddy-net:
    external: true
```

:::caution Less surface, fewer surprises
A service that only needs to be reachable through Caddy should not publish `80:80` to the host. Expose only what the system contract requires.
:::
