---
title: Backups
description: With a single disk, the backup is the only thing between an incident and a permanent loss.
type: concept
level: beginner
module: server
tools: [postgresql, cron, rsync, ssh]
prerequisites: [server.manual-deploy]
learningObjectives:
  - Tell apart the data that is unrecoverable from the data you can regenerate.
  - Schedule a backup that runs on its own and leaves the machine it backs up.
  - Verify a backup by restoring it, not by checking that the file exists.
takeaways:
  - A backup living on the machine it backs up is not a backup.
  - A backup that was never restored is an assumption, not a guarantee.
  - Deciding how much data you can lose is what sets how often you back up.
---

## What gets lost and what does not

Very different things live together on this server, and only some of them are irreplaceable.

| What is there | Recoverable without a backup? |
| --- | --- |
| The code | Yes, it is in the repository |
| The dependencies | Yes, they reinstall |
| The system configuration | With effort, if somebody remembers the steps |
| Environment variables and secrets | Only if they are written down elsewhere |
| The database | **No** |
| Files users uploaded | **No** |

Those last two rows are the backup. Everything else is convenience.

## Two numbers before choosing a tool

Before writing a single command, answer two questions. The answers determine everything else:

- **How much data you can afford to lose.** If you back up every 24 hours, a failure can cost you up to 24 hours of data. If that is unacceptable, a daily backup is not the tool.
- **How long you can take to come back.** Restoring a large database takes time, and that time is part of the outage.

A small project usually accepts losing a day and taking an hour. Putting a number on both is what stops you discovering it during the incident.

## A database dump

Copying the data files of a running database produces an inconsistent copy: it was writing while you copied. The right tool is the one the database itself ships.

```bash
pg_dump --format=custom myapp > /var/backups/myapp/myapp-$(date +%F).dump
```

`--format=custom` compresses and allows restoring individual tables. The date in the name is what stops you overwriting the good backup with one taken after the data was already corrupted.

## Get it off the machine

A backup in `/var/backups` on the same server protects against a `DROP TABLE` and nothing else. It does not protect against the disk failing, the provider losing the instance, or somebody with access deleting both at once.

```bash
rsync --archive --compress \
  /var/backups/myapp/ backup@other-host:/backups/myapp/
```

The rule usually quoted is **3-2-1**: three copies, on two different media, one of them off-site. For a small project, "the server plus object storage in another region" already covers the essential part.

:::caution[The account that backs up should not be able to delete]
If the server holds credentials with delete permission on the destination, whoever compromises the server deletes the backups too. Grant write without delete, or turn on versioning at the destination.
:::

## Make it happen without anybody remembering

```bash
# /etc/cron.d/myapp-backup
0 3 * * * marta /usr/local/bin/backup-myapp.sh
```

That script has to do four things: dump, copy off-site, delete old copies, and **exit with an error if anything failed**. A script that carries on after a failure produces empty files that look like backups.

```bash
#!/usr/bin/env bash
# /usr/local/bin/backup-myapp.sh
set -euo pipefail        # any failure stops the script

target=/var/backups/myapp
file="$target/myapp-$(date +%F).dump"

mkdir -p "$target"
pg_dump --format=custom myapp > "$file.tmp"
mv "$file.tmp" "$file"                  # it only exists under its final name if the dump finished

rsync --archive --compress "$target/" backup@other-host:/backups/myapp/

find "$target" -name 'myapp-*.dump' -mtime +14 -delete
```

The dump is written under a temporary name and renamed when it finishes: that way an interrupted `pg_dump` does not leave a half-written file that looks like a backup. The deletion goes last and only touches local copies older than fourteen days; without it the disk fills and the backup starts failing for lack of space, which is the most common way of ending up with no backups.

The user running it needs to be able to write to that folder and connect to the database. And since `cron` does not tell anyone when a job fails, the last piece is finding out: have the script call a monitoring service when it ends well, and let the alert fire when that call does not arrive.

## The step almost nobody takes

A backup is not verified until it has been restored. The file can exist, weigh what you expect, and be truncated.

```bash
createdb myapp_check
pg_restore --dbname=myapp_check /var/backups/myapp/myapp-2026-07-26.dump
psql myapp_check -c "select count(*) from users;"
dropdb myapp_check
```

Do it the day you set the backup up, and repeat it periodically. It is the only difference between having backups and believing you do.

## Check your understanding

<details>
<summary>Why does copying PostgreSQL's data directory while it runs not work as a backup?</summary>

Because the database is writing while you copy. The files you copied first belong to a different moment than the ones you copied last, so the set does not represent any state that actually existed. `pg_dump` produces a coherent copy of one specific instant.

</details>

<details>
<summary>You back up nightly at 3. The data is corrupted at 14:00. How much do you lose?</summary>

Eleven hours of data: everything since the 3 a.m. dump. If that is unacceptable, a daily backup is the wrong tool and you need something continuous, such as WAL archiving or a replica.

</details>

<details>
<summary>You have had daily backups for a year and have never restored one. What do you know about them?</summary>

That files were produced. Nothing more. You do not know whether they hold complete data, whether the database version can still read them, or how long a restore takes. A backup with no test restore is an assumption.

</details>

## Keep exploring

- [PostgreSQL · backup and restore](https://www.postgresql.org/docs/current/backup.html) — dumps, file-level copies and continuous archiving.
- [restic](https://restic.readthedocs.io/) — encrypted, deduplicated backups to remote storage.
