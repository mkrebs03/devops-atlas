---
title: Linux y terminal
description: La terminal como instrumento para observar, cambiar y explicar una máquina.
type: concept
level: beginner
module: foundations
tools: [linux, bash, terminal]
estimatedTime: 30 minutos
prerequisites: []
learningObjectives:
  - Explicar cómo la shell conecta programas mediante entradas y salidas.
  - Inspeccionar archivos, permisos y procesos con comandos repetibles.
takeaways:
  - La terminal convierte observaciones y cambios en instrucciones reproducibles.
  - Verificar ubicación, selección y permisos evita operaciones destructivas accidentales.
---

## La terminal no es magia

Una shell es un intérprete que recibe texto, ejecuta programas y conecta sus entradas y salidas. La ventaja no está en que sea críptica: está en que cada paso puede convertirse en una instrucción repetible.

```bash
pwd
ls -la
printf 'hello, atlas\n'
```

La salida también es una interfaz. Antes de ejecutar un comando destructivo, mira dónde estás, qué archivos selecciona y qué permisos tiene tu usuario.

## Archivos, permisos y composición

```bash
find . -maxdepth 2 -type f -name '*.log'
grep -R "ERROR" ./logs
du -sh ./data
```

El carácter `|` conecta la salida de un proceso con la entrada del siguiente. Una investigación útil suele ser una composición pequeña y legible:

```bash
ps aux | grep '[n]ginx'
```

El patrón `[n]ginx` evita que el propio `grep` aparezca en la lista. No es un truco para copiar: es una forma de expresar exactamente qué estás buscando.

## Procesos y servicios

Un proceso es una instancia viva de un programa. Tiene un PID, un usuario, un estado y, normalmente, archivos o sockets abiertos. En Linux moderno puedes empezar con:

```bash
ps -ef
ss -lntup
```

`ss` te ayuda a responder una pregunta operacional muy concreta: ¿hay algo escuchando en el puerto que espero?

:::caution No uses permisos elevados por reflejo
`sudo` amplía el radio de impacto de un comando. Primero intenta leer; eleva permisos únicamente cuando el sistema te lo pida y entiendas qué cambiará.
:::

## Modelo mental

Piensa en la terminal como una cámara de diagnóstico:

1. **Ubica** el contexto (`pwd`, `whoami`, `env`).
2. **Mide** el estado (`ps`, `free`, `df`, `ss`).
3. **Filtra** la evidencia (`grep`, `awk`, `sort`).
4. **Actúa** con el cambio mínimo.
5. **Verifica** que el estado final coincide con tu intención.
