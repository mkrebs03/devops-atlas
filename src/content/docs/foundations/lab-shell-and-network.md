---
title: Práctica · investigar una aplicación local
description: Levanta un servidor pequeño, encuentra su puerto y verifica su respuesta.
type: practice
level: beginner
module: foundations
tools: [python, curl, ss]
prerequisites: [foundations.terminal, foundations.networking]
learningObjectives:
  - Iniciar un servidor local e identificar el puerto donde escucha.
  - Verificar por separado la conexión y la respuesta HTTP de una aplicación.
  - Reconocer la diferencia entre una conexión rechazada y una respuesta HTTP de error.
takeaways:
  - Un proceso escuchando y una respuesta HTTP correcta son evidencias distintas.
  - Un fallo de conexión y un 404 apuntan a fronteras distintas del recorrido.
  - Combinar herramientas pequeñas permite reproducir una investigación de red.
---

## Objetivo

Vas a levantar un servidor local, comprobar en qué puerto escucha y separar un problema de conexión de un problema HTTP —el mismo razonamiento que usarás en producción, pero en tu máquina.

## Requisitos

- Una terminal (mejor si abres dos).
- Python 3, `curl` y `ss` disponibles.
- Unos 15 minutos.

## Paso 1 · publica una respuesta

```bash
mkdir -p /tmp/atlas-lab
printf 'atlas is listening\n' > /tmp/atlas-lab/index.html
cd /tmp/atlas-lab
python3 -m http.server 8080
```

Deja ese proceso corriendo y abre una segunda terminal para el resto.

## Paso 2 · observa el socket y verifica la respuesta

```bash
ss -lnt | grep ':8080'
curl -i http://127.0.0.1:8080/
```

Deberías ver un socket en estado `LISTEN` y una respuesta que empieza así:

```text
HTTP/1.0 200 OK
...
atlas is listening
```

Son **dos evidencias distintas**: el socket dice "hay algo escuchando"; el `200` dice "la aplicación respondió lo que esperaba".

## Paso 3 · provoca un fallo a propósito

Consulta un puerto donde nadie escucha:

```bash
curl -i http://127.0.0.1:9090/
# curl: (7) Failed to connect to 127.0.0.1 port 9090: Connection refused
```

`Connection refused` no es un `404`: ni siquiera hubo HTTP. Es la frontera de **conexión**, no la de aplicación. Ahora detén el servidor con `Ctrl+C`, reinícialo en el puerto `9090` y repite el `curl` anterior. ¿Qué cambió y por qué?

## Cuando algo no cuadra

| Síntoma | Frontera probable | Primer comando |
| --- | --- | --- |
| `Connection refused` | Nada escucha ese puerto | `ss -lnt` |
| Se queda colgado (timeout) | Firewall o dirección de escucha | `curl -v` |
| `200 OK` pero contenido raro | Aplicación / archivo servido | `curl -i` |

## Verificación

El laboratorio termina con una afirmación comprobable: **"el proceso escucha en el puerto que elegí y devuelve el archivo que publiqué"**. Si puedes demostrar eso con `ss` y `curl`, lograste el objetivo.

## Comprueba lo que entendiste

<details>
<summary>curl responde "Connection refused". ¿Qué NO deberías depurar todavía?</summary>

La aplicación. "Connection refused" significa que no había nada escuchando en ese puerto, así que nunca hubo una petición HTTP que analizar. Confirma primero con `ss -lnt` que el proceso escucha donde crees.

</details>

## Limpieza

```bash
rm -rf /tmp/atlas-lab
```
