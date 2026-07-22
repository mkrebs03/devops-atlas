---
title: Foundations
description: Learn to read a machine before trying to automate it.
type: concept
level: beginner
module: foundations
tools: [linux, terminal, networking]
estimatedTime: 10 minutes
prerequisites: []
learningObjectives:
  - Identify the basic signals of a machine and network before changing the system.
  - Order diagnostic questions to investigate a failure with evidence.
takeaways:
  - Observing the system before acting reduces unnecessary changes.
  - Machine, process, and network form a shared map for investigating problems.
---

## The first skill: observe

DevOps starts with concrete questions about a system: which process is listening, which file changed, why a request does not arrive, and what evidence supports a decision.

This module builds the minimum map for moving through Linux and a network. You do not need to memorize hundreds of commands; you need to learn how to connect small observations.

## The foundations map

| Signal | Useful question | Page |
| --- | --- | --- |
| Machine | Where am I and what resources do I have? | [Linux and terminal](./linux-cli/) |
| Process | What is running and who started it? | [Linux and terminal](./linux-cli/) |
| Network | Is the application listening and reachable? | [Essential networking](./networking/) |
| Practice | Can I reproduce an investigation? | [Shell and network lab](./lab-shell-and-network/) |

:::tip Change the order of your questions
When something fails, move from the outside in: DNS → connection → port → process → file → configuration. This reduces the temptation to change five things at once.
:::

## Expected outcome

You will be able to describe a request path, find a process and verify a connection using local tools. That vocabulary becomes the foundation for Git, Docker and CI/CD.
