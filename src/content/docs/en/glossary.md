---
title: Glossary
description: The terms used across the Atlas, defined in one line, each pointing at the page that explains it properly.
---

Every term is defined where it is first needed inside its own page. This is the shortcut: the minimum definition to keep you reading, plus the link to where it is explained in full. For specific tools, use the [A–Z tools index](/en/tools/).

## A

**Alert** — An automated notice that somebody is suffering something and there is something to do. Defined on symptoms, not on causes. → [Observability](/en/scaling/observability/)

**Approval gate** — The point where a person explicitly authorises the step into production. It is the only thing separating continuous delivery from continuous deployment. → [From build to release](/en/deployment/pipeline/)

**Artifact** — The packaged result of a build: a container image, a `.jar`, a folder of static files. It is what gets deployed, and it is not the code it came from. → [Continuous integration](/en/integration/)

## B

**Bind mount** — Mounting a folder from the host machine inside a container. Useful in development; in production it ties the content to that machine. → [Several containers with Compose](/en/containers/compose/)

**Blue-green** — A deployment strategy with two complete environments: one serves traffic while the other receives the new version. The switch is instant, and so is going back. → [Deployment strategies](/en/deployment/strategies/)

**Branch** — A movable reference naming a line of commits. It isolates one concrete intention for a short time. → [The Git model](/en/collaboration/git-model/)

## C

**Canary** — A deployment strategy that exposes the new version to a fraction of traffic and only widens it if the metrics stay healthy. → [Deployment strategies](/en/deployment/strategies/)

**CD** — Continuous delivery: the artifact is always ready to deploy. Continuous deployment: that last step also happens on its own once the checks pass. → [From build to release](/en/deployment/pipeline/)

**Certificate** — Proof that a domain is yours, issued by an authority the browser already trusts. It expires, so what matters is that it renews on its own. → [Reverse proxy and certificates](/en/server/proxy-tls/)

**CI** — Continuous integration: every proposed change is integrated and validated automatically on a clean server, not only on the machine of whoever wrote it. → [Continuous integration](/en/integration/)

**Commit** — A snapshot of the project that points at its predecessor. The smallest unit of history. → [The Git model](/en/collaboration/git-model/)

**Configuration drift** — The gradual separation between machines that started identical, caused by urgent fixes and updates applied at different moments. → [Why write infrastructure down](/en/infrastructure/why-iac/)

**Conflict** — The moment two branches change the same line and Git stops so that you decide. Not an error: a delegated decision. → [The Git model](/en/collaboration/git-model/)

**Container** — A process created from an image, with its own runtime environment. It is disposable; its data should not be. → [Docker without magic](/en/containers/docker/)

**Coverage** — The percentage of your code that the tests execute. It measures lines travelled, not behaviour verified. → [Tests in CI](/en/integration/tests-in-ci/)

## D

**Digest** — The cryptographic fingerprint of an image's content (`sha256:…`). Change one byte and the digest changes: it is the only image identifier that cannot be repointed. → [Docker without magic](/en/containers/docker/)

**Distribution** — A complete Linux system: the kernel packaged with base programs, a package manager, and a version policy. Debian, Ubuntu, Alpine. → [Linux](/en/foundations/linux/)

**DNS** — The system that translates a name into addresses. It does not carry your request; it only says where to go. → [Essential networking](/en/foundations/networking/)

**Docker Compose** — The file that describes several containers and the network they share, instead of chaining `docker run` commands. → [Several containers with Compose](/en/containers/compose/)

## E

**End-to-end test (E2E)** — Tests the system the way a person uses it. Slow and valuable: it answers whether the whole route works. → [The testing pyramid](/en/integration/pyramid/)

**Environment** — A complete installation of the system with its own configuration and data: development, staging, production. → [Continuous integration](/en/integration/)

## F

**Feature flag** — A condition in the code that decides at runtime whether a feature is active. It separates deploying the code from enabling the feature. → [Branching strategies](/en/integration/branching-strategy/)

**Firewall** — A filter that decides which connections are accepted before they reach the process. It explains why a connection hangs instead of being refused. → [Essential networking](/en/foundations/networking/)

**Flaky test** — A test that fails for reasons unrelated to behaviour: a timeout, a changed selector, a random value. It costs more than it protects. → [The testing pyramid](/en/integration/pyramid/)

## G

**Gateway** — A network's way out: where a machine hands packets whose destination falls outside its own subnet. → [Essential networking](/en/foundations/networking/)

**GitFlow** — A branching model with permanent `main` and `develop` branches plus `feature/*`, `release/*` and `hotfix/*`. It earns its cost only if you support several published versions at once. → [Branching strategies](/en/integration/branching-strategy/)

**Group** — A shared identity that lets several users reach the same things. The middle triplet in a file's permissions. → [Linux](/en/foundations/linux/)

## H

**HEAD** — The reference that says where you are working right now: the commit the next one will be built on. → [The Git model](/en/collaboration/git-model/)

**Health check** — The periodic check a balancer makes to know whether an instance can serve, and to pull it out of rotation if it cannot. → [Load balancing](/en/deployment/load-balancing/)

**Horizontal scaling** — Running several identical copies of the application and spreading traffic across them. No ceiling, but it requires instances that hold no state. → [When to scale, and how](/en/scaling/when-to-scale/)

## I

**Idempotence** — The property of an operation that can be repeated without changing anything the second time. It is what lets you reapply a definition without fear. → [Ansible and idempotence](/en/infrastructure/ansible/)

**Image** — An immutable package of layers that containers are created from. Identified by tag; its digest is the immutable fingerprint of what it contains. → [Docker without magic](/en/containers/docker/)

**Integration test** — Tests that several pieces cooperate, for example code plus a database. It answers whether they fit together. → [The testing pyramid](/en/integration/pyramid/)

**IP** — A machine's address on the network: the number packets must be sent to in order to arrive. → [Essential networking](/en/foundations/networking/)

**Issue** — The unit that records outstanding work — a bug, an improvement — with its discussion and its number. → [Pull requests and review](/en/collaboration/pull-requests/)

## J

**Job** — One unit of a workflow, running on its own machine. Jobs run in parallel unless you declare dependencies with `needs`. → [GitHub Actions](/en/integration/github-actions/)

## L

**Lint** — The cheapest check there is: a program reads the code without running it and flags whatever breaks a convention or smells like a bug. → [GitHub Actions](/en/integration/github-actions/)

**Load balancing** — Spreading requests across several identical instances of the same service. → [Load balancing](/en/deployment/load-balancing/)

**Log** — The event-by-event record of what the system did. Structured and carrying a correlation id, it reconstructs one specific case. → [Observability](/en/scaling/observability/)

## M

**Merge** — Integrating one branch into another with a commit that joins both lines and keeps the history as it happened. → [The Git model](/en/collaboration/git-model/)

**Metric** — A number measured over time: requests per second, errors per minute, milliseconds to respond. Cheap to keep and good for alerts. → [Observability](/en/scaling/observability/)

## O

**Object storage** — Keeping files as resources requested over HTTP from a service, rather than on one particular machine's disk. → [Moving state off the machine](/en/scaling/managed-services/)

**Observability** — Being able to answer questions you did not anticipate about what the system is doing, without deploying new code to find out. → [Observability](/en/scaling/observability/)

**OIDC** — The mechanism by which a workflow presents a signed token stating who it is and receives temporary credentials, instead of storing a long-lived key. → [Secrets and permissions](/en/integration/secrets/)

**Orchestrator** — A program that holds the system at a declared state — this many replicas, with these limits — by continuously comparing it with the real one. → [Orchestration](/en/scaling/orchestration/)

## P

**Percentile** — The value below which a given share of measurements falls. The p99 describes the worst real experience better than any average. → [Observability](/en/scaling/observability/)

**Pet server** — A unique, irreplaceable machine whose configuration exists only on itself. The opposite of treating machines as interchangeable. → [Why write infrastructure down](/en/infrastructure/why-iac/)

**Pipeline** — The automated sequence of stages a change travels from commit to published. → [Continuous integration](/en/integration/)

**Port** — The number that decides which of a machine's programs each connection enters. → [Essential networking](/en/foundations/networking/)

**Private address** — An IP valid only inside one particular network —`10.x`, `172.16–31.x`, `192.168.x`— and meaningless outside it. → [Essential networking](/en/foundations/networking/)

**Production** — The environment where the real users are. The only one where a failure happens to somebody. → [Continuous integration](/en/integration/)

**Protected branch** — A branch with rules: require review, require CI to pass, forbid direct pushes. It turns the team's agreements into something enforced. → [Pull requests and review](/en/collaboration/pull-requests/)

**Pull request** — The surface where a change is proposed, its intent explained, and its diff reviewed before integration. → [Pull requests and review](/en/collaboration/pull-requests/)

## R

**Rebase** — Reapplying your commits onto another base to get a linear history. It rewrites identifiers, so it belongs to private history. → [The Git model](/en/collaboration/git-model/)

**Recreate** — A deployment strategy that switches the old version off and the new one on. Simple, but with downtime. → [Deployment strategies](/en/deployment/strategies/)

**Registry** — The remote repository where images are published and from which servers pull them. Docker Hub, GHCR, your cloud's own. → [Docker without magic](/en/containers/docker/)

**Remote** — A reference to another copy of the repository. `fetch` brings its information; `pull` combines it with your local branch. → [The Git model](/en/collaboration/git-model/)

**Reverse proxy** — The server that receives all traffic and distributes it among your services. Where the TLS certificate and the routing decision live. → [Reverse proxy and certificates](/en/server/proxy-tls/)

**Rollback** — Going back to the previous version. What makes a deployment reversible, and what is worth rehearsing before you need it. → [Deployment strategies](/en/deployment/strategies/)

**Rolling** — A deployment strategy that replaces instances a few at a time: no downtime, but two versions coexist for a while. → [Deployment strategies](/en/deployment/strategies/)

**Rotate** — Invalidating a credential and issuing another. The only response that stops the damage of a leak; deleting the commit does not. → [Secrets and permissions](/en/integration/secrets/)

**Runner** — The machine that executes a job. Created clean and destroyed when it ends, so nothing survives between runs. → [GitHub Actions](/en/integration/github-actions/)

## S

**Secret** — A value that grants access to something: a token, an API key, a deployment password. It never lives in the repository. → [Secrets and permissions](/en/integration/secrets/)

**Service** — A process the system starts at boot, restarts if it dies, and logs for you. → [Linux](/en/foundations/linux/)

**SHA** — A cryptographic fingerprint. In the Atlas it shows up in two forms: the SHA of a commit, used as the tag of the image built from it, and the digest of the image itself. → [Docker without magic](/en/containers/docker/)

**Smoke test** — The minimum check that a version is alive: the health endpoint answers, the page loads, the database connects. → [Tests in CI](/en/integration/tests-in-ci/)

**Socket** — The IP + port pair: the real address a client connects to. → [Essential networking](/en/foundations/networking/)

**Staging area** — The intermediate step between your files and the commit, where `git add` places what you actually want to keep. It is why there are two different diffs. → [The Git model](/en/collaboration/git-model/)

**State (Terraform)** — The file mapping each declared resource to the real one at the provider. Without it, creating cannot be told from modifying. → [Terraform and state](/en/infrastructure/terraform/)

**Subnet** — The stretch of addresses that count as "my network". The mask (`/24`) marks where it ends, and with it whether a destination is reached directly or through the gateway. → [Essential networking](/en/foundations/networking/)

**systemd unit** — The file telling the system what to run, as which user, and under which conditions to retry it. What turns a process of yours into a service. → [Keeping the application alive](/en/server/processes/)

## T

**TLS** — The layer that encrypts the connection and proves the server is who it claims to be. The `s` in HTTPS. → [Essential networking](/en/foundations/networking/)

**Trace** — One request's path across every service it passes through, with the time spent on each leg. → [Observability](/en/scaling/observability/)

**Trunk-based** — A branching model where everyone integrates into `main` at least once a day and unfinished work travels switched off behind a feature flag. → [Branching strategies](/en/integration/branching-strategy/)

## U

**Unit test** — Tests one function or module in isolation. Fast, precise and cheap: the base of the pyramid. → [The testing pyramid](/en/integration/pyramid/)

## V

**Vertical scaling** — Swapping the machine for a bigger one. It touches neither code nor architecture, but it has a ceiling and leaves one single point of failure. → [When to scale, and how](/en/scaling/when-to-scale/)

**Volume** — Storage that lives outside the container and survives its deletion. Where the data you cannot lose goes. → [Docker without magic](/en/containers/docker/)

**VPS** — A Linux virtual machine with a public IP, handed to you booted and unconfigured. The simplest place an application really runs. → [Provisioning a VPS](/en/server/provisioning/)

## W

**Workflow** — The description of what should happen on a repository event: which jobs run, in which order, and with which permissions. → [GitHub Actions](/en/integration/github-actions/)
