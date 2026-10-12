---
title: Balanceo de carga
description: Varias instancias del mismo servicio, y la decisión de a cuál mandar cada petición.
type: concept
module: deployment
tools: [nginx, traefik, http]
prerequisites: [server.proxy-tls]
---

:::note
El balanceo entre varias instancias lo he estudiado, pero no lo he operado en un sistema real. En [Sobre este sitio](/about/) está el detalle de qué opero y qué no.
:::

## Cuando una instancia deja de bastar

Con un solo proceso detrás del proxy, dos cosas te limitan a la vez: la máquina se satura, y la caída de ese proceso es la caída del servicio. La respuesta a las dos es la misma: correr varias copias iguales.

Ahora el proxy tiene una decisión más que tomar. No solo *a qué servicio* mandar la petición, sino a **cuál de las copias**. Eso es **balanceo de carga**.

```nginx
upstream app {
  server 127.0.0.1:8081 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:8082 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:8083 max_fails=3 fail_timeout=30s;
}
```

El reparto por defecto es por turnos (*round robin*): una a cada una, en orden. También se puede repartir por menos conexiones activas, o fijar un cliente a una instancia concreta.

## El chequeo de salud es lo que lo hace útil

Sin él, el balanceador reparte a ciegas y sigue enviando tráfico a una instancia muerta: con tres copias y una caída, una de cada tres peticiones falla. Hay dos maneras de evitarlo.

- **Chequeo pasivo.** Es el del bloque de arriba. nginx open source no pregunta nada: observa las peticiones reales y, cuando una instancia acumula `max_fails` fallos dentro de la ventana de `fail_timeout`, la retira de la rotación durante esa ventana antes de volver a intentarlo. Barato, pero se entera fallando peticiones de usuarios de verdad.
- **Chequeo activo.** El balanceador sondea cada pocos segundos un endpoint como `/health` y retira a la instancia que no responde, sin esperar a que falle nada real. Así trabajan NGINX Plus, HAProxy, Traefik y los balanceadores de nube.

```bash
curl -s http://127.0.0.1:8081/health
# {"status":"ok","db":"ok"}
```

Que ese endpoint sea honesto es responsabilidad de la aplicación: si devuelve `200` sin comprobar sus dependencias, el balanceador mantendrá en rotación una instancia que no puede atender a nadie.

## Por qué sin esto no hay estrategias de despliegue

Aquí está la razón de fondo para leer esta página antes que la siguiente. Desplegar sin cortar el servicio siempre consiste en lo mismo: **cambiar a dónde apunta el tráfico**. Lo único que cambia entre estrategias es qué se toca en el balanceador.

| Estrategia | Qué cambia en el balanceador |
| --- | --- |
| Rolling | Sacas una instancia de rotación, la actualizas, la devuelves; repites |
| Blue-green | Cambias el destino del bloque `upstream` de la versión vieja a la nueva |
| Canary | Repartes con pesos: 95% a la versión actual, 5% a la nueva |

Y el rollback es la misma operación en sentido contrario, que es lo que lo hace rápido: no reconstruyes nada, vuelves a apuntar.

:::caution[Las conexiones abiertas no desaparecen solas]
Al retirar una instancia, las peticiones que ya estaba atendiendo siguen vivas. Un despliegue sin downtime necesita un *drenaje*: dejar de mandarle tráfico nuevo, esperar a que termine lo que tiene entre manos y solo entonces apagarla.
:::

## El estado estorba

Si tu aplicación guarda algo en su propia memoria —la sesión de quien inició sesión, un carrito, un archivo subido—, balancear la rompe: la siguiente petición del mismo usuario aterriza en otra instancia que no sabe nada de eso.

La salida no es atar cada usuario a una instancia, sino sacar el estado fuera: sesiones en una base de datos o en Redis, archivos en almacenamiento compartido. Una aplicación cuyas instancias son intercambiables es la que se puede escalar y desplegar sin ceremonia.

## Comprueba lo que entendiste

<details>
<summary>Tienes tres instancias y una se queda sin base de datos. ¿Por qué siguen fallando un tercio de las peticiones?</summary>

Porque el balanceador la sigue considerando sana. O no hay chequeo de salud configurado, o el endpoint devuelve `200` sin comprobar sus dependencias. Que el proceso siga vivo no significa que pueda atender: el chequeo tiene que verificar lo que la aplicación necesita para responder.

</details>

<details>
<summary>¿Por qué un blue-green es casi instantáneo, si la versión nueva tarda minutos en arrancar?</summary>

Porque arrancar y cambiar el tráfico son dos momentos distintos. La versión nueva se levanta y se verifica tranquilamente mientras nadie la usa; el despliegue en sí es solo el cambio de destino en el balanceador, que es inmediato. Y por eso volver atrás también lo es.

</details>

## Sigue explorando

- [nginx · balanceo de carga](https://nginx.org/en/docs/http/load_balancing.html) — los métodos de reparto y su configuración.
- [The Twelve-Factor App · procesos](https://12factor.net/es/processes) — por qué el estado no vive dentro del proceso.
