---
title: Mantener la aplicación viva
description: Un servicio de systemd que arranca tu aplicación al encender la máquina y la reintenta cuando falla.
type: tool
level: beginner
module: server
tools: [systemd, linux]
prerequisites: [server.manual-deploy]
learningObjectives:
  - Escribir una unidad de systemd que arranque la aplicación al encender la máquina.
  - Leer los logs de un servicio y distinguir por qué se detuvo.
  - Reconocer los límites de reintentar un proceso que falla siempre igual.
takeaways:
  - Un servicio pertenece al sistema, no a tu sesión, y por eso sobrevive a que cierres SSH.
  - Reiniciar automáticamente cubre el fallo transitorio y esconde el permanente.
  - journalctl es el primer sitio donde mirar cuando un servicio no arranca.
---

## De un proceso tuyo a un servicio del sistema

El proceso que arrancaste a mano tiene un problema estructural: es hijo de tu sesión SSH. Cuando esa sesión termina, el sistema se lleva por delante a sus hijos.

Un **gestor de procesos** rompe esa relación. El proceso pasa a ser hijo del sistema de inicio, que lo arranca al encender la máquina, lo vigila mientras corre y lo vuelve a levantar si muere. En Linux moderno ese gestor es **systemd**, y ya está instalado.

```mermaid
flowchart LR
  B["arranque"] --> S["systemd"] --> A["tu aplicación"]
  A -->|muere| S
```

## Una unidad de servicio

Una **unidad** es un archivo que describe qué ejecutar y bajo qué condiciones.

```ini
# /etc/systemd/system/miapp.service
[Unit]
Description=Mi aplicación
After=network-online.target postgresql.service

[Service]
Type=simple
User=marta
WorkingDirectory=/srv/miapp
EnvironmentFile=/etc/miapp.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Línea por línea, lo que hay que entender:

- `After=` no espera a que la base de datos esté lista, solo a que systemd la haya arrancado. Tu aplicación debe tolerar que aún no acepte conexiones y reintentar.
- `User=` evita que el servicio corra como `root`. Si alguien encuentra un fallo en tu aplicación, hereda los permisos de este usuario y no los de todo el sistema.
- `EnvironmentFile=` inyecta las variables que definiste, así que la unidad puede ser pública aunque los valores no lo sean.
- `Restart=on-failure` reintenta cuando el proceso termina con error, pero no cuando termina bien. `Restart=always` reintentaría también una parada limpia.
- `WantedBy=multi-user.target` es lo que hace que arranque sola al encender la máquina, y solo surte efecto tras el `enable`.

```bash
sudo systemctl daemon-reload         # relee los archivos de unidad
sudo systemctl enable --now miapp    # arrancar ahora y en cada encendido
sudo systemctl status miapp
```

## Leer lo que pasó

`systemd` recoge todo lo que tu aplicación escribe en la salida estándar y lo guarda en el diario del sistema. No necesitas configurar archivos de log: escribe a la salida estándar y `journalctl` lo tiene.

```bash
journalctl -u miapp -f              # seguir en vivo
journalctl -u miapp -n 100          # las últimas 100 líneas
journalctl -u miapp --since "10 min ago"
journalctl -u miapp -p err          # solo errores
```

El estado que devuelve `systemctl status` dice más de lo que parece:

| Estado | Qué significa |
| --- | --- |
| `active (running)` | El proceso está vivo |
| `activating (auto-restart)` | Está en el bucle de reintentos: arranca y muere |
| `failed` | Se agotaron los reintentos, o terminó con un error del que no se reintenta |
| `inactive (dead)` | Nadie lo ha arrancado, o se paró limpiamente |

:::caution[Reiniciar sin límite esconde el problema]
`Restart=always` sobre una aplicación que muere al arrancar —porque falta una variable, porque el puerto está ocupado— produce un bucle infinito que llena el diario y deja el servicio caído sin que nada avise. Por eso systemd corta tras cinco intentos en diez segundos. Ese corte no es el fallo: es lo que hace visible el fallo de verdad.
:::

## Recargar sin cortar

Cuando cambias el archivo de unidad, hay dos pasos y se confunden a menudo:

```bash
sudo systemctl daemon-reload    # systemd relee la unidad
sudo systemctl restart miapp    # el proceso se reinicia con la definición nueva
```

`daemon-reload` solo no cambia nada del proceso en marcha. `restart` sin `daemon-reload` reinicia con la definición vieja.

## Comprueba lo que entendiste

<details>
<summary>Tu servicio queda en activating (auto-restart) y no llega nunca a active. ¿Qué está pasando?</summary>

El proceso arranca y muere de inmediato, y systemd lo reintenta en bucle. La causa está en el diario: `journalctl -u miapp -n 50`. Lo habitual es una variable de entorno que falta, un puerto ya ocupado, o una ruta de `WorkingDirectory` o `ExecStart` que no existe.

</details>

<details>
<summary>¿Por qué enable y start son dos cosas distintas?</summary>

`start` arranca el servicio ahora. `enable` lo inscribe para que arranque en el próximo encendido. Si haces solo `start`, todo funciona hasta que la máquina se reinicia y el servicio no vuelve. `enable --now` hace las dos.

</details>

<details>
<summary>Editaste el archivo .service y reiniciaste, pero el cambio no se aplicó. ¿Qué falta?</summary>

`sudo systemctl daemon-reload`. systemd trabaja con una copia en memoria de las unidades; hasta que no la relee, `restart` vuelve a arrancar el proceso con la definición anterior.

</details>

## Sigue explorando

- [systemd.service · manual](https://www.freedesktop.org/software/systemd/man/systemd.service.html) — todas las directivas de la sección `[Service]`.
- [journalctl · manual](https://www.freedesktop.org/software/systemd/man/journalctl.html) — filtros por unidad, prioridad y tiempo.
