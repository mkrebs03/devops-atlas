---
title: Respaldos
description: Con un solo disco, el respaldo es lo único que separa un incidente de una pérdida definitiva.
type: concept
level: beginner
module: server
tools: [postgresql, cron, rsync, ssh]
prerequisites: [server.manual-deploy]
learningObjectives:
  - Distinguir qué datos son irrecuperables y cuáles se pueden volver a generar.
  - Programar un respaldo que se ejecute solo y salga de la máquina que respalda.
  - Comprobar un respaldo restaurándolo, no mirando que el archivo exista.
takeaways:
  - Un respaldo que vive en la máquina respaldada no es un respaldo.
  - Un respaldo que nunca se restauró es una suposición, no una garantía.
  - Decidir cuántos datos puedes perder es lo que fija cada cuánto respaldas.
---

## Qué se pierde y qué no

En este servidor conviven cosas muy distintas, y solo algunas son irremplazables.

| Qué hay | ¿Se puede recuperar sin respaldo? |
| --- | --- |
| El código | Sí, está en el repositorio |
| Las dependencias | Sí, se reinstalan |
| La configuración del sistema | Con trabajo, si alguien recuerda los pasos |
| Las variables de entorno y secretos | Solo si están anotados en otro sitio |
| La base de datos | **No** |
| Los archivos que subieron los usuarios | **No** |

Las dos últimas filas son el respaldo. Todo lo demás es conveniencia.

## Dos números antes de elegir herramienta

Antes de escribir un solo comando, responde dos preguntas. Las respuestas determinan todo lo demás:

- **Cuántos datos puedes permitirte perder.** Si respaldas cada 24 horas, un fallo puede costarte hasta 24 horas de datos. Si eso es inaceptable, el respaldo diario no te sirve.
- **Cuánto puedes tardar en volver.** Restaurar una base de datos grande lleva tiempo, y ese tiempo es parte de la caída.

Un proyecto pequeño suele aceptar perder un día y tardar una hora. Ponerle número a las dos cosas es lo que evita descubrirlo durante el incidente.

## Un volcado de la base de datos

Copiar los archivos de datos de una base de datos en marcha produce una copia inconsistente: la estabas copiando mientras escribía. La herramienta correcta es la que trae la propia base de datos.

```bash
pg_dump --format=custom miapp > /var/backups/miapp-$(date +%F).dump
```

`--format=custom` comprime y permite restaurar tablas sueltas. La fecha en el nombre es lo que evita sobrescribir el respaldo bueno con uno hecho después de que los datos se corrompieran.

## Que salga de la máquina

Un respaldo en `/var/backups` del mismo servidor protege de un `DROP TABLE` y de nada más. No protege de que el disco falle, de que el proveedor pierda la instancia, ni de que alguien con acceso borre las dos cosas a la vez.

```bash
rsync --archive --compress \
  /var/backups/ respaldo@otro-host:/respaldos/miapp/
```

La regla que se suele citar es **3-2-1**: tres copias, en dos medios distintos, una de ellas fuera del sitio. Para un proyecto pequeño, "el servidor y un almacenamiento de objetos en otra región" ya cumple lo esencial.

:::caution[La cuenta que respalda no debe poder borrar]
Si el servidor tiene credenciales con permiso de borrado sobre el destino, quien comprometa el servidor borra también los respaldos. Da permiso de escritura y no de borrado, o activa versionado en el destino.
:::

## Que ocurra sin que nadie se acuerde

```bash
# /etc/cron.d/miapp-backup
0 3 * * * marta /usr/local/bin/respaldo-miapp.sh
```

Ese script debe hacer tres cosas y no dos: volcar, copiar fuera y **terminar con error si algo falló**. Un script que sigue adelante tras un fallo produce archivos vacíos que parecen respaldos.

```bash
#!/usr/bin/env bash
set -euo pipefail        # cualquier fallo detiene el script
```

También hay que borrar lo viejo, o el disco se llena y el respaldo empieza a fallar por falta de espacio — que es la forma más común de quedarse sin respaldos.

## El paso que casi nadie da

Un respaldo no está comprobado hasta que se restaura. El archivo puede existir, pesar lo esperado y estar truncado.

```bash
createdb miapp_prueba
pg_restore --dbname=miapp_prueba /var/backups/miapp-2026-07-26.dump
psql miapp_prueba -c "select count(*) from usuarios;"
dropdb miapp_prueba
```

Hazlo el día que montas el respaldo, y repítelo cada cierto tiempo. Es la única diferencia entre tener respaldos y creer que los tienes.

## Comprueba lo que entendiste

<details>
<summary>¿Por qué copiar el directorio de datos de PostgreSQL en caliente no sirve como respaldo?</summary>

Porque la base de datos está escribiendo mientras copias. Los archivos que copiaste primero corresponden a un momento distinto de los que copiaste al final, así que el conjunto no representa ningún estado que haya existido de verdad. `pg_dump` produce una copia coherente de un instante concreto.

</details>

<details>
<summary>Respaldas cada noche a las 3. Los datos se corrompen a las 14. ¿Cuánto pierdes?</summary>

Once horas de datos: todo lo ocurrido desde el volcado de las 3. Si eso es inaceptable, el respaldo diario es la herramienta equivocada y necesitas algo continuo, como el archivado de WAL o una réplica.

</details>

<details>
<summary>Tienes respaldos diarios desde hace un año y nunca restauraste ninguno. ¿Qué sabes de ellos?</summary>

Que se generaron archivos. Nada más. No sabes si contienen datos completos, si la versión de la base de datos aún puede leerlos, ni cuánto tarda la restauración. Un respaldo sin restauración de prueba es una suposición.

</details>

## Sigue explorando

- [PostgreSQL · copia de seguridad y restauración](https://www.postgresql.org/docs/current/backup.html) — volcados, copia a nivel de archivos y archivado continuo.
- [restic](https://restic.readthedocs.io/) — respaldos cifrados y deduplicados hacia almacenamiento remoto.
