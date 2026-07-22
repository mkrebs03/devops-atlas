---
title: Docker sin magia
description: Imágenes, contenedores, redes y volúmenes explicados desde el contrato que cumplen.
type: tool
level: beginner
module: delivery
tools: [docker, containers, nginx]
estimatedTime: 40 minutos
prerequisites: [linux-cli, networking]
---

## Imagen y contenedor no son sinónimos

Una **imagen** es un paquete inmutable de capas. Un **contenedor** es un proceso creado a partir de esa imagen con un entorno de ejecución concreto.

```bash
docker build -t atlas-web:local .
docker run --rm -p 8080:80 atlas-web:local
```

La etiqueta ayuda a encontrar una imagen; no convierte `latest` en una versión confiable. Para producción, usa un identificador inmutable como un SHA.

## El contrato de un contenedor

Antes de ejecutar una imagen, define:

- Qué proceso arranca.
- En qué puerto escucha.
- Qué configuración recibe.
- Qué datos deben sobrevivir al proceso.
- Cómo se verifica que está sano.

Si la aplicación es estática, el contenedor puede ser mínimo: un servidor web que lee archivos y no guarda estado.

## Redes y nombres

En una red Docker, los servicios pueden encontrarse por nombre. No necesitas publicar cada puerto al host. Si Caddy y una aplicación comparten una red externa, Caddy puede enrutar internamente al nombre del servicio.

```yaml
services:
  atlas:
    image: ghcr.io/example/devops-atlas:sha-abc123
    networks: [caddy-net]

networks:
  caddy-net:
    external: true
```

:::caution Menos superficie, menos sorpresas
Un servicio que solo necesita ser accesible desde Caddy no debe publicar `80:80` al host. Expón únicamente lo que el contrato del sistema necesita.
:::
