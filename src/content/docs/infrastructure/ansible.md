---
title: Ansible y la idempotencia
description: Describir cómo debe quedar una máquina por dentro, y poder aplicarlo mil veces con el mismo resultado.
type: tool
module: infrastructure
tools: [ansible, ssh, yaml]
prerequisites: [infrastructure.why-iac]
---

:::note
Ansible lo he estudiado, pero no lo uso en un sistema real. En [Sobre este sitio](/about/) está el detalle de qué opero y qué no.
:::

## Sin agente, por SSH

Ansible no instala nada en las máquinas que gestiona. Se conecta por SSH —el acceso que ya configuraste—, copia unos módulos temporales, los ejecuta y los borra. Eso lo hace aplicable a servidores que ya existen sin prepararlos antes.

El inventario dice sobre qué máquinas actúa:

```ini
# inventory.ini
[web]
app-1 ansible_host=203.0.113.10
app-2 ansible_host=203.0.113.11

[web:vars]
ansible_user=marta
```

## Un playbook describe el resultado

```yaml
- name: Configurar servidores web
  hosts: web
  become: true

  tasks:
    - name: Los paquetes necesarios están instalados
      ansible.builtin.apt:
        name: [nginx, certbot, python3-certbot-nginx]
        state: present
        update_cache: true

    - name: El usuario de la aplicación existe
      ansible.builtin.user:
        name: atlas
        system: true
        shell: /usr/sbin/nologin

    - name: La configuración de nginx está en su sitio
      ansible.builtin.template:
        src: templates/atlas.conf.j2
        dest: /etc/nginx/sites-available/atlas
        owner: root
        mode: "0644"
      notify: recargar nginx

    - name: El servicio está activo y arranca al encender
      ansible.builtin.systemd_service:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: recargar nginx
      ansible.builtin.systemd_service:
        name: nginx
        state: reloaded
```

Fíjate en cómo están redactados los nombres: «los paquetes están instalados», no «instalar los paquetes». Así funciona cada tarea: comprueba si la afirmación ya es cierta y solo actúa si no lo es.

El `notify` añade una pieza útil: el *handler* que recarga nginx se ejecuta **una sola vez y solo si la plantilla cambió**. Sin eso, cada ejecución recargaría el servicio aunque no hubiera nada nuevo.

## Qué significa idempotente

```bash
ansible-playbook -i inventory.ini site.yml
```

```
PLAY RECAP
app-1  : ok=4  changed=2  unreachable=0  failed=0
app-2  : ok=4  changed=0  unreachable=0  failed=0
```

Ese resumen dice más de lo que parece. `changed=0` significa que la máquina ya estaba como el playbook describe: se comprobaron cuatro afirmaciones y ninguna necesitó acción. `changed=2` en la otra significa que dos cosas no coincidían y se corrigieron.

Aplicado de forma rutinaria, ese número **es tu medidor de deriva**. Un `changed` que aparece en una máquina que nadie tocó dice que alguien la tocó.

:::caution[El módulo command rompe la idempotencia]
`ansible.builtin.command` y `shell` ejecutan lo que les des, siempre, y siempre informan `changed`. Úsalos solo cuando no exista un módulo específico, y acompáñalos de `creates:` o `when:` para que sepan cuándo no hacer nada.
:::

## Comprobar antes de aplicar

```bash
ansible-playbook -i inventory.ini site.yml --check --diff
```

`--check` simula sin cambiar nada; `--diff` muestra las diferencias exactas de los archivos que tocaría. Es el equivalente al `plan` de Terraform, con una salvedad: una tarea `command` no puede simularse, así que el ensayo es tan fiable como idempotente sea el playbook.

Para desplegar sin cortar el servicio, `serial` limita cuántas máquinas se tocan a la vez:

```yaml
- hosts: web
  serial: 1        # de una en una, no todas a la vez
```

## Secretos con Vault

Las contraseñas que el playbook necesita se cifran en el propio repositorio:

```bash
ansible-vault encrypt group_vars/production/secrets.yml
ansible-playbook site.yml --ask-vault-pass
```

El archivo cifrado sí se versiona; la clave para descifrarlo, no. Es una solución razonable para un equipo pequeño, y no sustituye a un almacén de secretos cuando crece.

## Terraform o Ansible

No compiten. Terraform crea la máquina; Ansible la deja lista por dentro. Lo habitual es usar los dos, y también es válido usar solo Ansible cuando los servidores ya existen y nadie va a crear más.

| | Terraform | Ansible |
| --- | --- | --- |
| Responde | ¿Qué máquinas y redes hay? | ¿Cómo está cada una por dentro? |
| Guarda estado | Sí, en un archivo | No, lo consulta cada vez |
| Actúa sobre | La API del proveedor | La máquina, por SSH |

Que Ansible no guarde estado es una ventaja y una limitación a la vez: no hay archivo que corromper ni bloquear, pero tampoco sabe qué recursos creó, así que no puede destruirlos.

## Sigue explorando

- [Ansible · índice de módulos](https://docs.ansible.com/ansible/latest/collections/index_module.html) — el módulo específico casi siempre existe.
- [Ansible · buenas prácticas](https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html) — estructura de roles, inventarios y variables.
