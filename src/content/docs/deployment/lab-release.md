---
title: Práctica · promover y revertir
description: Corre dos versiones, cambia el tráfico a la nueva y vuelve atrás, un blue-green local.
type: practice
level: intermediate
module: deployment
tools: [docker, nginx, curl]
prerequisites: [deployment.pipeline]
learningObjectives:
  - Ejecutar dos versiones de un servicio e intercambiar cuál recibe tráfico.
  - Practicar un cambio estilo blue-green y su rollback.
  - Verificar cada paso con una comprobación HTTP.
takeaways:
  - Cambiar el tráfico entre dos versiones hace el despliegue reversible.
  - Un rollback es solo volver a apuntar a la versión anterior.
  - Verificar antes y después convierte el despliegue en evidencia.
---

## Objetivo

Vas a correr dos versiones de un sitio (azul y verde), verificar la nueva en aislamiento, cambiar el tráfico a la nueva y revertir, un blue-green en tu máquina.

En un sistema real, quien cambia el tráfico es un [proxy inverso](/server/proxy-tls/) y el cambio no interrumpe nada. Aquí el papel del proxy lo hace el puerto 8080: apagas el contenedor que lo ocupa y arrancas otro en su lugar. La secuencia de decisiones es la misma —verificar en aislamiento, cambiar, verificar, poder volver—, pero hay un instante de corte que en producción no habría.

## Requisitos

- Docker.
- Unos 15 minutos.

## Paso 1 · la versión azul está en producción (8080)

```bash
mkdir -p /tmp/atlas-release-lab && cd /tmp/atlas-release-lab
printf '<h1>v1 azul</h1>\n' > blue.html
docker run -d --rm --name atlas-blue -p 8080:80 \
  -v "$PWD/blue.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8080/     # v1 azul
```

## Paso 2 · despliega la verde en aislamiento (8081)

```bash
printf '<h1>v2 verde</h1>\n' > green.html
docker run -d --rm --name atlas-green -p 8081:80 \
  -v "$PWD/green.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8081/     # v2 verde (nadie en producción la ve aún)
```

La verde ya corre y la verificaste sin exponerla a los usuarios.

## Paso 3 · cambia el tráfico a la verde (8080)

```bash
docker stop atlas-blue
docker run -d --rm --name atlas-live -p 8080:80 \
  -v "$PWD/green.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8080/     # ahora v2 verde
```

Producción (8080) sirve la verde. El cambio fue casi instantáneo.

## Paso 4 · revierte

Algo salió mal: vuelve a la azul.

```bash
docker stop atlas-live
docker run -d --rm --name atlas-blue -p 8080:80 \
  -v "$PWD/blue.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8080/     # de vuelta a v1 azul
```

Revertir fue volver a apuntar a la versión anterior. Eso es lo que un blue-green te compra.

## Verificación

La afirmación comprobable: pudiste servir la nueva versión y volver a la anterior sin reconstruir nada.

## Comprueba lo que entendiste

<details>
<summary>En el paso 2 la verde corre en 8081 pero los usuarios siguen en 8080. ¿Por qué es útil?</summary>

Porque puedes verificar la versión nueva en aislamiento —sin que ningún usuario la vea— antes de darle tráfico. Si algo está mal, lo descubres en 8081 y nunca llega a producción. Ese es el corazón del blue-green.

</details>

## Limpieza

```bash
docker stop atlas-blue atlas-green 2>/dev/null
rm -rf /tmp/atlas-release-lab
```
