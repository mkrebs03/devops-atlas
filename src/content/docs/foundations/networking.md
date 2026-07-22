---
title: Redes esenciales
description: DNS, puertos y HTTP explicados como un recorrido que puedes inspeccionar.
type: concept
level: beginner
module: foundations
tools: [dns, http, curl, ss]
estimatedTime: 35 minutos
prerequisites: [linux-cli]
---

## Una petición es una ruta

Cuando visitas `https://example.com/api`, no ocurre una sola cosa. El cliente necesita resolver un nombre, abrir una conexión, negociar TLS y enviar una petición HTTP.

```text
nombre → DNS → IP → puerto → TCP/TLS → HTTP → respuesta
```

Cada flecha es una frontera de diagnóstico. Si conoces la frontera, sabes qué evidencia pedir.

## DNS no es HTTP

DNS traduce nombres a registros. HTTP usa esos resultados para hablar con un servidor. Puedes separar ambas preguntas:

```bash
dig +short example.com
curl -I https://example.com
```

El primero busca una respuesta DNS. El segundo muestra cabeceras HTTP. Si el nombre no resuelve, todavía no tiene sentido depurar la aplicación.

## Puertos y sockets

Un puerto identifica el punto de entrada de un proceso dentro de una máquina. Ver un puerto abierto no prueba que la aplicación funcione, pero no verlo sí descarta parte del camino.

```bash
ss -lnt
curl -v http://127.0.0.1:8080/health
```

Busca tres datos: dirección de escucha, puerto y proceso responsable. `127.0.0.1` solo acepta tráfico local; `0.0.0.0` puede aceptar tráfico de varias interfaces y exige más cuidado.

:::note Una capa cada vez
Cuando una URL falla, prueba primero resolución, luego conexión y por último la aplicación. Un timeout y un `404` no son el mismo problema.
:::

## El contrato HTTP

Una respuesta HTTP comunica más que un cuerpo:

| Parte | Pregunta |
| --- | --- |
| Estado | ¿La operación fue entendida y aceptada? |
| Cabeceras | ¿Qué tipo de contenido y políticas se aplican? |
| Cuerpo | ¿Qué dato recibe el cliente? |

El hábito DevOps es hacer visible ese contrato en logs, pruebas y documentación.
