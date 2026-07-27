---
title: Secretos y permisos
description: Dónde viven las credenciales que el pipeline necesita, y por qué el permiso mínimo importa más que esconderlas bien.
type: concept
level: intermediate
module: integration
tools: [github-actions, ssh, yaml]
prerequisites: [integration.github-actions, server.manual-deploy]
learningObjectives:
  - Distinguir configuración de secreto por lo que pasa si se filtra.
  - Conceder a cada job el permiso mínimo que necesita para su tarea.
  - Reaccionar a un secreto expuesto rotándolo en lugar de borrándolo.
takeaways:
  - Un secreto en el historial de Git sigue ahí aunque el commit posterior lo borre.
  - Rotar es la única respuesta válida a una filtración; ocultar no es responder.
  - Una credencial de corta vida vale más que una larga bien guardada.
---

## Qué es un secreto y qué no

No todo lo que cambia entre entornos es secreto. La prueba es simple: pregúntate qué pasa si ese valor aparece en un repositorio público.

| Valor | ¿Secreto? | Por qué |
| --- | --- | --- |
| `NODE_ENV=production` | No | No da acceso a nada |
| El dominio del sitio | No | Es público por definición |
| La URL de la base de datos | Sí | Lleva usuario y contraseña dentro |
| Un token de despliegue | Sí | Permite publicar en tu nombre |
| La clave pública de un certificado | No | Es pública, está en el nombre |
| La clave privada SSH del runner | Sí | Es la puerta al servidor |

Confundirlos tiene dos costes simétricos: tratar como secreto lo que no lo es complica la operación sin ganar nada, y tratar como configuración una credencial la publica.

## Dónde viven

Un secreto no puede estar en el repositorio, porque quien clone el código se lo lleva. Vive en el almacén que ofrece la plataforma, cifrado, y el workflow lo recibe como una variable en tiempo de ejecución.

```yaml
jobs:
  deploy:
    environment: production        # el entorno puede exigir aprobación
    steps:
      - name: Desplegar
        env:
          SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
        run: ./scripts/deploy.sh
```

GitHub oculta en el registro de ejecución cualquier valor que coincida con un secreto. Es una red de seguridad útil y no una garantía: si tu script imprime la clave en base64, o partida en dos líneas, el filtro no la reconoce y aparece completa en el log.

## El permiso importa más que el escondite

Esta es la parte que se salta con más frecuencia. Un secreto perfectamente guardado que concede acceso total sigue siendo una llave maestra: quien logre ejecutar algo en tu pipeline la hereda entera.

```yaml
permissions:
  contents: read       # por defecto para todo el workflow
  packages: write      # solo donde de verdad se publica
```

Declarar `permissions` a nivel de workflow con lo mínimo, y ampliarlo solo en el job que lo necesita, limita el daño de cualquier paso comprometido — incluida una acción de terceros que actualizaron ayer.

Dos hábitos concretos que valen más que cualquier otra medida:

- **Fija las acciones de terceros por SHA**, no por etiqueta. `uses: alguien/accion@v3` ejecuta lo que hoy tenga esa etiqueta, que el autor puede mover. `@a1b2c3d…` ejecuta bytes concretos.
- **No des a CI una credencial personal.** Un token de tu cuenta tiene todo tu acceso. Usa el token que la propia plataforma emite para el workflow, o una identidad dedicada al despliegue con permiso sobre un solo destino.

:::caution[Los pull requests de forks no reciben secretos, y es a propósito]
Cualquiera puede abrir un pull request desde una copia de tu repositorio, con el workflow modificado. Si esa ejecución tuviera tus secretos, publicarlos sería trivial. Por eso las ejecuciones desde forks corren sin ellos — y por eso el job que despliega debe activarse tras integrar en `main`, no en el pull request.
:::

## Credenciales que caducan solas

El paso siguiente es no guardar credenciales de larga vida en ninguna parte. Con **OIDC**, tu workflow presenta al proveedor de nube un token firmado por GitHub que dice quién es —qué repositorio, qué rama, qué entorno— y el proveedor le devuelve credenciales temporales que caducan en minutos.

```yaml
permissions:
  id-token: write      # necesario para pedir el token OIDC
  contents: read
```

Lo que cambia no es la comodidad: es que ya no hay un valor de larga vida que rotar, filtrar ni olvidar. Y la confianza se declara del lado del proveedor, que puede exigir que la petición venga de un repositorio y una rama concretos.

## Cuando uno se escapa

Ocurre. Lo importante es qué se hace, y hay una única respuesta correcta:

1. **Rotar primero.** Invalida el valor y emite uno nuevo. Esto detiene el daño; nada de lo demás lo hace.
2. **Después limpiar.** Borrar el commit no sirve por sí solo: sigue en el historial de cada clon y de cada fork.
3. **Revisar el registro de accesos** del servicio afectado, por si ya se usó.

```bash
git log -p -S 'AKIA' -- .          # ¿aparece algo con esta forma en el historial?
```

El orden no es negociable. Reescribir el historial antes de rotar deja el secreto válido en manos de cualquiera que ya hubiera clonado, y da la sensación de haberlo resuelto.

## Comprueba lo que entendiste

<details>
<summary>Subiste una clave de API por error y la borraste en el commit siguiente. ¿Estás a salvo?</summary>

No. El commit anterior sigue en el historial y en cada clon o fork que ya exista, así que la clave se puede recuperar. La única acción que detiene el daño es rotarla: invalidar ese valor y emitir uno nuevo. Limpiar el historial viene después y es secundario.

</details>

<details>
<summary>¿Por qué fijar una acción de terceros por SHA en vez de por etiqueta?</summary>

Porque una etiqueta es un puntero que su autor puede mover a otro código en cualquier momento, y tu workflow ejecutaría eso con los permisos y secretos que le hayas dado. Un SHA identifica bytes concretos: lo que revisaste es lo que corre.

</details>

<details>
<summary>¿Qué gana un despliegue con OIDC frente a guardar una clave de acceso como secreto?</summary>

Que deja de existir un valor de larga vida. El workflow presenta un token firmado que identifica repositorio, rama y entorno, y recibe credenciales que caducan en minutos. No hay nada que rotar cada seis meses ni nada que siga sirviendo si se filtra un log antiguo.

</details>

## Sigue explorando

- [GitHub · secretos cifrados](https://docs.github.com/es/actions/security-guides/using-secrets-in-github-actions) — dónde se guardan y cómo se exponen al workflow.
- [GitHub · OIDC](https://docs.github.com/es/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) — credenciales temporales sin secretos almacenados.
- [OWASP · gestión de secretos](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) — el ciclo completo, incluida la rotación.
