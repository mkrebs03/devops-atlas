---
title: Por qué escribir la infraestructura
description: El servidor que nadie sabe reconstruir, la deriva entre entornos, y qué cambia cuando la máquina se describe en un archivo.
type: concept
level: intermediate
module: infrastructure
tools: [terraform, ansible, ssh]
prerequisites: [server.provisioning, scaling.when-to-scale]
learningObjectives:
  - Explicar qué es la deriva de configuración y por qué aparece sin que nadie la provoque.
  - Distinguir aprovisionar recursos de configurar lo que corre dentro de ellos.
  - Reconocer cuándo escribir la infraestructura todavía no compensa.
takeaways:
  - Un servidor que nadie sabe reconstruir es un punto de fallo sin respaldo.
  - La deriva no viene de errores, viene de arreglos urgentes que nadie anotó.
  - Describir la infraestructura la vuelve revisable, versionada y reproducible.
---

## El servidor que nadie sabe reconstruir

Cuando configuraste tu VPS a mano, cada decisión quedó en un sitio: la máquina. El usuario que creaste, el paquete que instalaste para resolver un fallo, la línea que cambiaste en `sshd_config` a las dos de la mañana. Ninguna de esas cosas está escrita en ninguna parte.

Eso funciona hasta que necesitas una segunda máquina igual. Entonces descubres que "igual" no se puede reproducir, porque la lista completa de lo que hiciste no existe: existe una máquina que funciona y nadie sabe exactamente por qué.

Se le llama **servidor mascota**: único, irreemplazable, con nombre propio y con una historia que solo conocen quienes estaban. Lo contrario es tratarlas como **ganado**: máquinas intercambiables, que se destruyen y se vuelven a crear porque su definición está en otra parte.

:::caution[Un respaldo de datos no respalda la configuración]
Volcar la base de datos protege los datos. No protege las decenas de decisiones de sistema que hacen que la aplicación arranque. Si el disco desaparece, tienes los datos y no tienes dónde ponerlos.
:::

## La deriva no la causa nadie

Aunque montes dos servidores el mismo día con los mismos pasos, en seis meses no serán iguales. A eso se le llama **deriva de configuración**, y no aparece por descuido:

- Un incidente a medianoche se arregla en la máquina afectada, y solo en esa.
- Una actualización de seguridad se aplica cuando toca, que no es el mismo día en las dos.
- Alguien prueba algo en *staging* y lo deja puesto.
- Un paquete cambia de versión por defecto entre dos instalaciones separadas por semanas.

El resultado es el fallo más caro de diagnosticar que existe: funciona en un entorno y no en el otro, y la diferencia no está documentada porque nadie sabe cuál es.

## Qué cambia al escribirla

Si la infraestructura vive en archivos versionados, hereda todo lo que ya tienes montado para el código:

| Se vuelve | Porque |
| --- | --- |
| Revisable | Un cambio de infraestructura pasa por un pull request |
| Versionado | `git log` dice quién abrió ese puerto y cuándo |
| Reproducible | Crear el segundo entorno es ejecutar lo mismo |
| Reversible | Volver atrás es volver al commit anterior |
| Documentado | El archivo es la documentación, y no puede quedar desactualizado |

Esa última fila es la que más pesa. Cualquier documento sobre cómo está configurado un servidor empieza a mentir desde el día que se escribe. Un archivo que **es** la configuración no puede mentir: si mintiera, la máquina no sería así.

## Dos trabajos distintos

Se confunden constantemente y usan herramientas distintas porque resuelven cosas distintas:

```mermaid
flowchart LR
  T["aprovisionar
crear la máquina, la red, el disco"] --> C["configurar
instalar, ajustar, desplegar dentro"]
```

- **Aprovisionar** es crear los recursos que antes pedías por un panel web: la instancia, la IP, el registro DNS, el volumen, las reglas del cortafuegos del proveedor. Es el terreno de **Terraform**.
- **Configurar** es lo que ocurre dentro de una máquina que ya existe: instalar paquetes, escribir archivos, arrancar servicios. Es el terreno de **Ansible**.

Se pueden usar juntos —Terraform crea la máquina y Ansible la deja lista— y también por separado. Si tus servidores ya existen y solo quieres dejar de configurarlos a mano, Ansible solo es una respuesta completa.

## Declarativo, y qué implica

Ambas herramientas trabajan igual: describes **el resultado** y ellas calculan los pasos. Eso tiene una consecuencia práctica que conviene entender antes de escribir nada.

Un script que hace `adduser marta` falla la segunda vez que se ejecuta, porque el usuario ya existe. Una descripción que dice "el usuario marta existe" se puede ejecutar mil veces y el resultado es el mismo. Esa propiedad se llama **idempotencia**, y es lo que permite volver a aplicar la misma definición sin miedo — que es exactamente lo que haces cada vez que cambias una línea.

## Cuándo todavía no compensa

No es gratis. Escribir la infraestructura añade un lenguaje, una herramienta, un estado que mantener y una forma nueva de romper cosas. Señales de que aún no toca:

- Una sola máquina, un solo entorno, que reconstruirías en una tarde.
- El proyecto todavía cambia de forma cada semana.
- Nadie más que tú va a tocarla nunca.

Y señales de que sí: más de un entorno que debe parecerse, más de una persona con acceso, o la pregunta "¿qué pasa si esta máquina desaparece?" sin una respuesta cómoda.

Un punto intermedio honesto: un script de aprovisionamiento en Bash, versionado, que no es idempotente pero al menos **existe**. Está muy por debajo de Terraform y muy por encima de la memoria de alguien.

## Comprueba lo que entendiste

<details>
<summary>¿Por qué dos servidores creados con los mismos pasos dejan de ser iguales?</summary>

Por la deriva de configuración. Los arreglos urgentes se aplican donde duele, las actualizaciones ocurren en momentos distintos, y las versiones por defecto de los paquetes cambian entre dos instalaciones separadas en el tiempo. Ninguna de esas cosas es un error, y todas juntas producen dos máquinas distintas que nadie puede comparar.

</details>

<details>
<summary>¿Qué diferencia hay entre lo que resuelve Terraform y lo que resuelve Ansible?</summary>

Terraform crea los recursos: la instancia, la red, el disco, el registro DNS. Ansible configura lo que hay dentro de una máquina que ya existe: paquetes, archivos, servicios. Uno responde "qué máquinas hay" y el otro "cómo está cada una por dentro".

</details>

<details>
<summary>¿Por qué un archivo de infraestructura no puede quedar desactualizado y un documento sí?</summary>

Porque el documento describe la realidad desde fuera y nada obliga a que coincidan; en cuanto alguien cambia algo sin actualizarlo, miente. El archivo no describe la infraestructura: la define. Si no coincidiera con la máquina, al aplicarlo la máquina cambiaría para coincidir.

</details>

## Sigue explorando

- [Martin Fowler · SnowflakeServer](https://martinfowler.com/bliki/SnowflakeServer.html) — el servidor irreproducible, y por qué aparece.
- [The Twelve-Factor App · paridad entre entornos](https://12factor.net/es/dev-prod-parity) — mantener desarrollo y producción parecidos.
