---
title: Deploying by hand
description: Install the runtime, bring the code across and start the application, watching what each step costs.
type: concept
module: server
tools: [ssh, git, linux, node]
prerequisites: [server.provisioning]
---

## The simplest deployment there is

You have a machine you can log into and an application in a repository. The shortest path between the two is this one, and it is worth walking it by hand once before automating it: the steps that annoy you are exactly the ones you will later want a machine to do.

```mermaid
flowchart LR
  R["runtime"] --> C["code"] --> D["dependencies"] --> E["configuration"] --> A["start"]
```

## Install the runtime

Your application needs its language's interpreter or virtual machine, and it needs the **same version** you developed against. The package the distribution ships is usually several versions behind, so installing from the project's own repository is normal.

```bash
# the NodeSource repository, for the major version you develop against
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node --version     # is it the version you expected?
psql --version     # and the database?
```

Running a downloaded script with `sudo` means trusting whoever publishes it; read it first, or install through the manual steps the project itself documents.

Write those versions down. They are the first entry on the list of things a new server would have to reproduce.

## Bring the code across

```bash
sudo mkdir -p /srv/myapp && sudo chown marta:marta /srv/myapp
git clone https://github.com/your-user/myapp.git /srv/myapp
cd /srv/myapp && npm ci --omit=dev
```

`npm ci` installs exactly what the lockfile says instead of re-resolving whatever the version ranges allow. On a server that matters: you want the dependencies you tested, not the latest compatible ones.

If the repository is private, the server needs credentials to clone it. The right option is a **deploy key**: an SSH key generated on the server, registered against that one repository, and read-only. A token from your personal account would grant access to everything you can see.

## Configuration is not code

The database URL, the payment gateway key and the port it listens on all differ between your machine and the server. If they live in the repository, you either publish secrets or maintain per-environment files that drift apart.

The way out is **environment variables**: values the system hands to the process when it starts, outside the code.

```bash
sudo install -o marta -g marta -m 600 /dev/null /etc/myapp.env
```

```ini
# /etc/myapp.env — never in the repository
NODE_ENV=production
PORT=8080
DATABASE_URL=postgres://myapp:...@127.0.0.1:5432/myapp
```

The `600` permissions matter: the file holds secrets and only its owner should be able to read it.

:::caution[A secret that was in a commit is still there]
Deleting it in a later commit does not remove it from history: it stays recoverable in any clone of the repository. If one escapes, the only valid response is to rotate it — invalidate the value and issue a new one — not to delete it.
:::

## Start it

```bash
cd /srv/myapp
set -a && . /etc/myapp.env && set +a
node server.js
```

The application answers. And then you close the terminal, and it stops answering.

## Why this does not hold

It is worth naming the failures now, because each one gets a specific owner later:

| What happens | Why |
| --- | --- |
| You close SSH and the service dies | The process is a child of your session and leaves with it |
| The server reboots and nothing comes back | Nobody told the system to start your application |
| The application crashes and stays down | Nothing is watching the process to retry it |
| Updating cuts the service for a few seconds | You stop the old version before the new one is ready |
| A new server does not come out like this one | The steps you took exist only in your memory |

The first three are solved by a process manager. The fourth, by a deployment strategy. The fifth is the one that pushes towards packaging and automating.

## Keep exploring

- [The Twelve-Factor App · config](https://12factor.net/config) — why configuration lives in the environment.
- [GitHub · deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys) — granting read access to a single repository.
