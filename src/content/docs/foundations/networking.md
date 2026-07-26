---
title: Redes esenciales
description: DNS, puertos, TLS y HTTP explicados como un recorrido que puedes inspeccionar.
type: concept
level: beginner
module: foundations
tools: [dns, http, tls, curl, ss]
prerequisites: [foundations.terminal]
learningObjectives:
  - Seguir una petición desde DNS hasta la respuesta HTTP, incluido TLS.
  - Distinguir una dirección privada de una pública y saber por dónde sale el tráfico.
  - Distinguir fallos de resolución, conexión, puerto y aplicación.
  - Leer un código de estado y las cabeceras como parte del contrato HTTP.
takeaways:
  - Cada frontera de red ofrece una señal concreta que puedes comprobar.
  - Una dirección privada solo significa algo dentro de su red; el gateway es la salida.
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

Una **IP** es la dirección de una máquina en la red: el número al que hay que enviar los paquetes para que lleguen. Los nombres existen porque esas direcciones cambian, se reparten entre varias máquinas y nadie las memoriza.

DNS convierte un nombre en registros: una IP en un registro `A` (o `AAAA` para IPv6), un alias en un `CNAME`. No transporta tu petición; solo te dice a dónde ir.

```bash
dig +short example.com        # ¿qué IP responde este nombre?
cat /etc/hosts                # ¿hay un override local?
```

Si el nombre no resuelve, depurar la aplicación es prematuro: todavía no sabes a qué máquina le estás hablando.

## No toda dirección se alcanza desde fuera

Una IP resuelta no siempre es una IP alcanzable. Buena parte de las direcciones que verás a diario son **privadas**: válidas dentro de una red concreta y sin significado fuera de ella.

| Rango | Dónde aparece |
| --- | --- |
| `10.0.0.0/8` | redes de empresa y nubes privadas |
| `172.16.0.0/12` | redes de Docker por defecto |
| `192.168.0.0/16` | routers domésticos y de oficina |
| `127.0.0.0/8` | *loopback*: la propia máquina (`localhost`) — no es privada, nunca sale a la red |

El sufijo `/24` es la **máscara de subred**: dice cuántos bits iniciales de la dirección identifican a la red y cuántos quedan para las máquinas de dentro. `192.168.1.40/24` significa "todo lo que empiece por `192.168.1.` está en mi red". Esa frontera decide el siguiente salto: si el destino cae dentro, la máquina le habla directo; si cae fuera, entrega el paquete al **gateway** —la puerta de salida hacia el resto de las redes—, que es a donde apunta la ruta por defecto.

```bash
ip addr     # ¿qué direcciones y máscaras tiene esta máquina?
ip route    # ¿cuál es el gateway por defecto?
```

De ahí salen dos confusiones frecuentes. Un servicio que responde en `192.168.1.40:3000` desde tu portátil no es alcanzable desde internet: esa dirección no existe fuera de tu red, y lo que el mundo ve es la IP pública del router, que traduce entre ambas. Y un contenedor tiene su propia dirección privada dentro de la red de Docker, así que "escucha en el puerto 3000" solo significa algo si dices en qué red escucha.

## Conexión: puertos, sockets y TLS

Una máquina tiene una IP y muchos programas corriendo a la vez. El **puerto** es el número que decide a cuál de ellos entra cada conexión: 80 para HTTP, 443 para HTTPS, y el que tú elijas para tu aplicación. La pareja IP + puerto es lo que se llama un **socket**, y es la dirección real a la que se conecta un cliente.

Ver un puerto abierto no prueba que la aplicación funcione, pero no verlo descarta parte del camino.

```bash
ss -lnt                                  # ¿qué escucha localmente?
curl -v https://example.com 2>&1 | head  # narra resolución, TCP y TLS
```

`curl -v` cuenta la ruta paso a paso: resuelve la IP, abre TCP contra el puerto 443, presenta el **certificado** TLS y solo entonces envía la petición HTTP. `127.0.0.1` acepta tráfico local; `0.0.0.0` puede aceptar tráfico de varias interfaces y exige más cuidado. TLS existe para dos cosas: cifrar la conexión y probar que el servidor es quien dice ser.

Entre el cliente y ese puerto suele haber un **firewall**: un filtro que decide qué conexiones se aceptan antes de que lleguen al proceso. Distingue un síntoma que confunde a mucha gente: si nadie escucha, la máquina rechaza y ves `Connection refused` de inmediato; si un firewall descarta el paquete en silencio, no ves nada y la conexión se queda colgada hasta agotar el tiempo.

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
