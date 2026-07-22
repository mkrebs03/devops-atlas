---
title: Linux and terminal
description: Use the terminal to observe, change and explain a machine.
type: concept
level: beginner
module: foundations
tools: [linux, bash, terminal]
estimatedTime: 30 minutes
prerequisites: []
learningObjectives:
  - Explain how the shell connects programs through input and output.
  - Inspect files, permissions, and processes with repeatable commands.
takeaways:
  - The terminal turns observations and changes into reproducible instructions.
  - Checking location, selection, and permissions prevents accidental destructive operations.
---

## The terminal is not magic

A shell interprets text, runs programs and connects their input and output. Its value is not that it looks cryptic; it is that each step can become a repeatable instruction.

```bash
pwd
ls -la
printf 'hello, atlas\n'
```

Output is an interface too. Before running a destructive command, check where you are, which files it selects and which permissions your user has.

## Files, permissions and composition

```bash
find . -maxdepth 2 -type f -name '*.log'
grep -R "ERROR" ./logs
du -sh ./data
```

The `|` character connects one process's output to the next process's input. A useful investigation is often a small, readable composition:

```bash
ps aux | grep '[n]ginx'
```

The `[n]ginx` pattern keeps the `grep` process out of its own result. It is not a trick to copy; it expresses exactly what you are looking for.

## Processes and services

A process is a live instance of a program. It has a PID, a user, a state and usually open files or sockets. On modern Linux, start with:

```bash
ps -ef
ss -lntup
```

`ss` answers a concrete operational question: is something listening on the port I expect?

:::caution Do not reach for elevated permissions by reflex
`sudo` increases the blast radius of a command. Read first; elevate only when the system asks you to and you understand what will change.
:::

## Mental model

Think of the terminal as a diagnostic camera:

1. **Locate** the context (`pwd`, `whoami`, `env`).
2. **Measure** the state (`ps`, `free`, `df`, `ss`).
3. **Filter** the evidence (`grep`, `awk`, `sort`).
4. **Act** with the smallest useful change.
5. **Verify** that the final state matches your intent.
