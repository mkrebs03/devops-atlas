---
title: Keeping the application alive
description: A systemd service that starts your application when the machine boots and retries it when it fails.
type: tool
level: beginner
module: server
tools: [systemd, linux]
prerequisites: [server.manual-deploy]
learningObjectives:
  - Write a systemd unit that starts the application when the machine boots.
  - Read a service's logs and tell apart the reasons it stopped.
  - Recognise the limits of retrying a process that fails the same way every time.
takeaways:
  - A service belongs to the system, not to your session, which is why it survives closing SSH.
  - Automatic restarts cover the transient failure and hide the permanent one.
  - journalctl is the first place to look when a service will not start.
---

## From a process of yours to a system service

The process you started by hand has a structural problem: it is a child of your SSH session. When that session ends, the system takes its children with it.

A **process manager** breaks that relationship. The process becomes a child of the init system, which starts it when the machine boots, watches it while it runs, and brings it back if it dies. On modern Linux that manager is **systemd**, and it is already installed.

```mermaid
flowchart LR
  B["boot"] --> S["systemd"] --> A["your application"]
  A -->|dies| S
```

## A service unit

A **unit** is a file describing what to run and under which conditions.

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My application
After=network-online.target postgresql.service

[Service]
Type=simple
User=marta
WorkingDirectory=/srv/myapp
EnvironmentFile=/etc/myapp.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Line by line, what matters:

- `After=` does not wait for the database to be ready, only for systemd to have started it. Your application must tolerate it not accepting connections yet, and retry.
- `User=` keeps the service from running as `root`. If someone finds a flaw in your application, they inherit this user's permissions rather than the whole system's.
- `EnvironmentFile=` injects the variables you defined, so the unit can be public even though the values are not.
- `Restart=on-failure` retries when the process exits with an error, but not when it exits cleanly. `Restart=always` would also retry a clean stop.
- `WantedBy=multi-user.target` is what makes it start on its own at boot, and it only takes effect after `enable`.

```bash
sudo systemctl daemon-reload         # re-read the unit files
sudo systemctl enable --now myapp    # start now and at every boot
sudo systemctl status myapp
```

## Reading what happened

`systemd` collects everything your application writes to standard output and stores it in the system journal. You do not need to configure log files: write to standard output and `journalctl` has it.

```bash
journalctl -u myapp -f              # follow live
journalctl -u myapp -n 100          # the last 100 lines
journalctl -u myapp --since "10 min ago"
journalctl -u myapp -p err          # errors only
```

The state `systemctl status` returns says more than it looks:

| State | What it means |
| --- | --- |
| `active (running)` | The process is alive |
| `activating (auto-restart)` | It is in the retry loop: starting and dying |
| `failed` | Retries ran out, or it exited with an error that is not retried |
| `inactive (dead)` | Nobody has started it, or it stopped cleanly |

:::caution[Restarting without limit hides the problem]
`Restart=always` on an application that dies at startup — because a variable is missing, because the port is taken — produces an infinite loop that fills the journal and leaves the service down with nothing raising an alarm. That is why systemd gives up after five attempts in ten seconds. That cut-off is not the failure: it is what makes the real failure visible.
:::

## Reloading without cutting

When you change the unit file there are two steps, and they get confused often:

```bash
sudo systemctl daemon-reload    # systemd re-reads the unit
sudo systemctl restart myapp    # the process restarts with the new definition
```

`daemon-reload` alone changes nothing about the running process. `restart` without `daemon-reload` restarts with the old definition.

## Check your understanding

<details>
<summary>Your service sits at activating (auto-restart) and never reaches active. What is going on?</summary>

The process starts and dies immediately, and systemd retries it in a loop. The cause is in the journal: `journalctl -u myapp -n 50`. The usual suspects are a missing environment variable, a port already taken, or a `WorkingDirectory` or `ExecStart` path that does not exist.

</details>

<details>
<summary>Why are enable and start two different things?</summary>

`start` runs the service now. `enable` registers it to start at the next boot. If you only `start`, everything works until the machine reboots and the service does not come back. `enable --now` does both.

</details>

<details>
<summary>You edited the .service file and restarted, but the change did not apply. What is missing?</summary>

`sudo systemctl daemon-reload`. systemd works from an in-memory copy of the units; until it re-reads that copy, `restart` starts the process again with the previous definition.

</details>

## Keep exploring

- [systemd.service · manual](https://www.freedesktop.org/software/systemd/man/systemd.service.html) — every directive in the `[Service]` section.
- [journalctl · manual](https://www.freedesktop.org/software/systemd/man/journalctl.html) — filters by unit, priority and time.
