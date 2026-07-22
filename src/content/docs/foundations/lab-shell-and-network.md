---
title: Lab · investigar una aplicación local
description: Levanta un servidor pequeño, encuentra su puerto y verifica su respuesta.
type: lab
level: beginner
module: foundations
tools: [python, curl, ss, terminal]
estimatedTime: 25 minutos
prerequisites: [linux-cli, networking]
---

## Objetivo

Vas a iniciar un servidor local, comprobar qué puerto ocupa y separar un problema de conexión de un problema HTTP.

## Requisitos

- Una terminal.
- Python 3 instalado.
- `curl` y `ss` disponibles.

## Paso 1 · crea una respuesta

```bash
mkdir -p /tmp/atlas-lab
printf 'atlas is listening\n' > /tmp/atlas-lab/index.html
cd /tmp/atlas-lab
python3 -m http.server 8080
```

Deja ese proceso ejecutándose y abre otra terminal.

## Paso 2 · observa y verifica

```bash
ss -lnt | grep ':8080'
curl -i http://127.0.0.1:8080/
```

Debes ver un socket escuchando y una respuesta `200 OK` con el texto `atlas is listening`.

## Paso 3 · cambia una variable

Detén el servidor con `Ctrl+C` y vuelve a iniciarlo en el puerto `9090`. ¿Qué comandos cambian? ¿Qué resultado esperas de `curl` si consultas todavía el puerto `8080`?

:::tip Verificación
Un buen laboratorio termina con una afirmación comprobable. Aquí la afirmación es: “el proceso escucha en el puerto que elegí y devuelve el archivo que publiqué”.
:::

## Limpieza

```bash
rm -rf /tmp/atlas-lab
```
