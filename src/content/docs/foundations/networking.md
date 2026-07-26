---
title: Redes esenciales
description: DNS, puertos, TLS y HTTP explicados como un recorrido que puedes inspeccionar.
type: concept
level: beginner
module: foundations
tools: [dns, http, tls, curl, ss]
prerequisites: [foundations.linux-cli]
learningObjectives:
  - Seguir una petición desde DNS hasta la respuesta HTTP, incluido TLS.
  - Distinguir fallos de resolución, conexión, puerto y aplicación.
  - Leer un código de estado y las cabeceras como parte del contrato HTTP.
takeaways:
  - Cada frontera de red ofrece una señal concreta que puedes comprobar.
  - DNS, TCP, TLS y HTTP responden preguntas diferentes dentro de la misma ruta.
  - Un código de estado dice tanto como el cuerpo de la respuesta.
---

## Una petición es una ruta

Cuando visitas `https://example.com/api`, no ocurre una sola cosa. El cliente resuelve un nombre, abre una conexión, negocia TLS y recién entonces envía una petición HTTP. Cada tramo es una **frontera de diagnóstico**: si sabes en cuál estás, sabes qué evidencia pedir.

```mermaid
flowchart LR
  N["Nombre"] --> D["DNS · IP"]
  D --> T["TCP · puerto"]
  T --> L["TLS · certificado"]
  L --> H["HTTP · petición"]
  H --> R["Respuesta"]
```

Un fallo vive en una de esas fronteras, no en todas a la vez. La regla es recorrerlas de afuera hacia adentro.

## DNS traduce, no transporta

DNS convierte un nombre en registros: una IP en un registro `A` (o `AAAA` para IPv6), un alias en un `CNAME`. No transporta tu petición; solo te dice a dónde ir.

```bash
dig +short example.com        # ¿qué IP responde este nombre?
cat /etc/hosts                # ¿hay un override local?
```

Si el nombre no resuelve, depurar la aplicación es prematuro: todavía no sabes a qué máquina le estás hablando.

## Conexión: puertos, sockets y TLS

Un puerto identifica el punto de entrada de un proceso dentro de una máquina. Ver un puerto abierto no prueba que la aplicación funcione, pero no verlo descarta parte del camino.

```bash
ss -lnt                                  # ¿qué escucha localmente?
curl -v https://example.com 2>&1 | head  # narra resolución, TCP y TLS
```

`curl -v` cuenta la ruta paso a paso: resuelve la IP, abre TCP contra el puerto 443, presenta el **certificado** TLS y solo entonces envía la petición HTTP. `127.0.0.1` acepta tráfico local; `0.0.0.0` puede aceptar tráfico de varias interfaces y exige más cuidado. TLS existe para dos cosas: cifrar la conexión y probar que el servidor es quien dice ser.

:::note[Una capa cada vez]
Cuando una URL falla, comprueba primero resolución (DNS), luego conexión (TCP/TLS) y por último la aplicación (HTTP). Un timeout y un `404` no son el mismo problema.
:::

## El contrato HTTP

Una respuesta HTTP comunica mucho más que un cuerpo. El **código de estado** resume qué pasó:

| Familia | Significado | Ejemplo |
| --- | --- | --- |
| `2xx` | Éxito | `200 OK` |
| `3xx` | Redirección | `301 Moved Permanently` |
| `4xx` | Error del cliente | `404 Not Found` |
| `5xx` | Error del servidor | `503 Service Unavailable` |

Un `4xx` dice "tu petición está mal"; un `5xx` dice "el servidor falló". Confundirlos envía la investigación al lado equivocado.

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://example.com
```

Las cabeceras completan el contrato: tipo de contenido, caché y políticas. El hábito DevOps es hacer visible ese contrato en logs, pruebas y documentación.

## Comprueba lo que entendiste

<details>
<summary>curl devuelve "Could not resolve host". ¿En qué frontera estás?</summary>

En DNS: el nombre no se tradujo a una IP, así que no hubo conexión ni HTTP. Revisa `dig +short`, tu resolvedor y `/etc/hosts` antes de mirar la aplicación.

</details>

<details>
<summary>Recibes 503 en lugar de 200. ¿Es problema del cliente o del servidor?</summary>

Del servidor: la familia `5xx` indica que no pudo completar una petición válida —a menudo sobrecarga o una dependencia caída. Un `4xx` sería del cliente. Mira los logs y el estado del servicio, no tu petición.

</details>

## Sigue explorando

- [MDN · HTTP](https://developer.mozilla.org/es/docs/Web/HTTP) — referencia clara de métodos, estados y cabeceras.
- [High Performance Browser Networking](https://hpbn.co/) — cómo viaja de verdad una petición (gratis en línea).
- `man curl` y `man dig` — las banderas que usarás a diario.
