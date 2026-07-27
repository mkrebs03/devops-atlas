---
title: Ansible and idempotence
description: Describing how a machine should look inside, and being able to apply it a thousand times with the same result.
type: tool
level: intermediate
module: infrastructure
tools: [ansible, ssh, yaml]
prerequisites: [infrastructure.why-iac]
learningObjectives:
  - Write a playbook that leaves a machine in the described state.
  - Explain what makes a task idempotent and why it matters on reapplying.
  - Read a run's recap to know what actually changed.
takeaways:
  - Ansible describes a machine's end state, not the sequence of commands.
  - An idempotent task can be repeated without changing anything the second time.
  - The changed count is the signal telling you whether the machine had drifted.
---

## Agentless, over SSH

Ansible installs nothing on the machines it manages. It connects over SSH — the access you already configured — copies a few temporary modules, runs them and deletes them. That makes it applicable to servers that already exist, with no preparation.

The inventory says which machines it acts on:

```ini
# inventory.ini
[web]
app-1 ansible_host=203.0.113.10
app-2 ansible_host=203.0.113.11

[web:vars]
ansible_user=marta
```

## A playbook describes the result

```yaml
- name: Configure web servers
  hosts: web
  become: true

  tasks:
    - name: Required packages are installed
      ansible.builtin.apt:
        name: [nginx, certbot, python3-certbot-nginx]
        state: present
        update_cache: true

    - name: The application user exists
      ansible.builtin.user:
        name: atlas
        system: true
        shell: /usr/sbin/nologin

    - name: The nginx configuration is in place
      ansible.builtin.template:
        src: templates/atlas.conf.j2
        dest: /etc/nginx/sites-available/atlas
        owner: root
        mode: "0644"
      notify: reload nginx

    - name: The service is running and starts at boot
      ansible.builtin.systemd_service:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: reload nginx
      ansible.builtin.systemd_service:
        name: nginx
        state: reloaded
```

Notice how the names are phrased: "packages are installed", not "install packages". That is not a style detail — it is exactly what each task does. It checks whether the statement is already true and only acts if it is not.

The `notify` adds a useful piece: the handler reloading nginx runs **once, and only if the template changed**. Without it, every run would reload the service even with nothing new.

## What idempotent means

```bash
ansible-playbook -i inventory.ini site.yml
```

```
PLAY RECAP
app-1  : ok=4  changed=2  unreachable=0  failed=0
app-2  : ok=4  changed=0  unreachable=0  failed=0
```

That recap says more than it looks. `changed=0` means the machine was already as the playbook describes: four statements were checked and none needed action. `changed=2` on the other means two things did not match and were corrected.

Applied routinely, that number **is your drift gauge**. A `changed` appearing on a machine nobody touched says somebody touched it.

:::caution[The command module breaks idempotence]
`ansible.builtin.command` and `shell` run whatever you give them, always, and always report `changed`. Use them only when no specific module exists, and pair them with `creates:` or `when:` so they know when to do nothing. A playbook full of `shell` is a script with extra ceremony.
:::

## Checking before applying

```bash
ansible-playbook -i inventory.ini site.yml --check --diff
```

`--check` simulates without changing anything; `--diff` shows the exact differences in the files it would touch. It is the equivalent of Terraform's `plan`, with one honest caveat: a `command` task cannot be simulated, so the rehearsal is only as reliable as the playbook is idempotent.

To roll out without cutting the service, `serial` limits how many machines are touched at once:

```yaml
- hosts: web
  serial: 1        # one at a time, not all at once
```

## Secrets with Vault

The passwords the playbook needs are encrypted inside the repository itself:

```bash
ansible-vault encrypt group_vars/production/secrets.yml
ansible-playbook site.yml --ask-vault-pass
```

The encrypted file is versioned; the key to decrypt it is not. It is a reasonable solution for a small team, and it does not replace a secrets store as things grow.

## Terraform or Ansible

They do not compete. Terraform creates the machine; Ansible makes it ready inside. Using both is the usual arrangement, and using only Ansible is equally valid when the servers already exist and nobody will create more.

| | Terraform | Ansible |
| --- | --- | --- |
| Answers | Which machines and networks exist? | What does each one look like inside? |
| Keeps state | Yes, in a file | No, it checks every time |
| Acts on | The provider's API | The machine, over SSH |

Ansible keeping no state is an advantage and a limitation at once: there is no file to corrupt or lock, but it also does not know which resources it created, so it cannot destroy them.

## Check your understanding

<details>
<summary>You run the same playbook twice in a row. What do you expect to see the second time?</summary>

`changed=0`. The first run left the machine as the playbook describes, so the second checks the same statements and finds them true. If `changed` appears on the second run, some task is not idempotent — almost always a `command` or `shell` with no condition.

</details>

<details>
<summary>Why use the apt module rather than command with apt install?</summary>

Because the module checks whether the package is already installed and only acts if it is missing, so it reports `changed` only when something really changed. `command` always runs and always reports `changed`, which loses the signal that separates a machine that drifted from one that was fine.

</details>

<details>
<summary>Your playbook touches 20 servers and one task restarts nginx. What do you add to avoid cutting the service?</summary>

`serial`, so Ansible works in batches rather than across all twenty at once, and a `handler` so the restart only happens if the configuration changed. With `serial: 1` the balancer always has nineteen healthy instances while the remaining one is touched.

</details>

## Keep exploring

- [Ansible · module index](https://docs.ansible.com/ansible/latest/collections/index_module.html) — the specific module almost always exists.
- [Ansible · tips and tricks](https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html) — structuring roles, inventories and variables.
