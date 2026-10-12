---
title: Practice · from empty VPS to HTTPS
description: Walk the whole path on a real machine, from the first connection to a valid certificate.
type: practice
module: server
tools: [ssh, ufw, systemd, nginx, certbot]
prerequisites: [server.processes, server.proxy-tls]
---

:::note[Written walkthrough, not run end to end]
I have not run this walkthrough from start to finish. The output shown is illustrative and may differ from yours. If a step does not work, [open an issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## End state

`myapp` answering at `https://your-domain.com` from a VPS: started by systemd, reachable only through nginx, with the certificate issued and its renewal scheduled.

## Requirements

- A freshly created VPS running Ubuntu 24.04 or Debian 12, and its public IP. It costs money for as long as it exists: the last section says how to delete it.
- A domain whose DNS `A` record already points at that IP. **Check this before you start** with `dig +short your-domain.com`: without resolved DNS, the certificate step cannot work.
- The `myapp` repository on GitHub, from the [branches walkthrough](/en/collaboration/lab-git-branching/). If you do not have it, step 3 lets you create the file by hand.
- A terminal with `ssh` and `ssh-keygen`.
- About 45 minutes.

The commands use `marta`, `YOUR_IP`, `YOUR_USER` and `your-domain.com`; replace them with your own.

## Step 1 · Get in and create your user

```bash
ssh-keygen -t ed25519 -C "atlas-practice"     # on your machine, if you have no key yet
ssh-copy-id root@YOUR_IP
ssh root@YOUR_IP
```

Once inside:

```bash
adduser marta
usermod -aG sudo marta
mkdir -p /home/marta/.ssh
cp ~/.ssh/authorized_keys /home/marta/.ssh/
chown -R marta:marta /home/marta/.ssh
chmod 700 /home/marta/.ssh
```

**Signal:** from a second terminal, `ssh marta@YOUR_IP` gets in without asking for a password. Do not close the `root` session until you have checked, and do the rest of the walkthrough as `marta`.

## Step 2 · Close access and ports

```bash
printf 'PermitRootLogin no\nPasswordAuthentication no\n' \
  | sudo tee /etc/ssh/sshd_config.d/00-atlas.conf
sudo sshd -t && sudo systemctl restart ssh
sudo sshd -T | grep -Ei '^(permitrootlogin|passwordauthentication)'
```

The file goes in `sshd_config.d` and starts with `00` because `sshd` keeps the first value it reads for each option. Many cloud images ship a file of their own there that turns passwords back on; one that is read earlier wins.

**Signal:** the last command prints `permitrootlogin no` and `passwordauthentication no`. That is the configuration `sshd` actually applies, not the one you believe you wrote.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Signal:** `sudo ufw status verbose` shows `deny (incoming)` and only three allowed rules. Log in again from another terminal to confirm you still have access.

## Step 3 · Bring the application

```bash
sudo apt update && sudo apt install -y nodejs git
sudo mkdir -p /srv/myapp && sudo chown marta:marta /srv/myapp
git clone https://github.com/YOUR_USER/myapp.git /srv/myapp
```

If your repository is private, or you do not have one, create `/srv/myapp/server.js` with the contents of [The sample application](/en/sample-app/#the-file).

Configuration goes in a separate file, outside the repository:

```bash
printf 'PORT=8080\nAPP_VERSION=manual-1\n' | sudo tee /etc/myapp.env > /dev/null
sudo chmod 600 /etc/myapp.env
```

There is no `HOST` variable, so the application listens on `127.0.0.1`: it is not reachable from outside, only through the proxy.

**Signal:** `node /srv/myapp/server.js` starts and, from another SSH session, `curl -s localhost:8080/health` returns `{"status":"ok"}`. Stop the process with `Ctrl+C`.

## Step 4 · Turn it into a service

```bash
sudo tee /etc/systemd/system/myapp.service > /dev/null <<'EOF'
[Unit]
Description=myapp
After=network-online.target

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
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now myapp
systemctl status myapp
```

**Signal:** the status says `active (running)`, and `curl -s localhost:8080/` answers `myapp manual-1`: the service read the environment file.

Now the test that really tells a service from a process of yours:

```bash
sudo reboot
# wait a minute, log back in
curl -s localhost:8080/health
```

**Signal:** it answers after the reboot without you starting anything. `enable` did its job.

## Step 5 · The proxy in front

```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/myapp > /dev/null <<'EOF'
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

sudo ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

**Signal:** from your own machine, not from the server, `curl -s http://your-domain.com/health` answers. And `curl -m 5 http://YOUR_IP:8080/` does **not**: the application port is closed to the outside.

## Step 6 · The certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot asks for an email, obtains the certificate, and edits your nginx block to add TLS and the redirect from port 80.

**Signal:** `curl -sI https://your-domain.com/health` returns `200`, and `curl -sI http://your-domain.com/health` returns `301` to HTTPS.

## Step 7 · Check the renewal

The certificate expires, and what fails is not issuing it but renewing it:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

**Signal:** there is a scheduled timer and the dry run finishes without errors.

## When something does not add up

| Symptom | Likely cause | First command |
| --- | --- | --- |
| `ssh marta@YOUR_IP` asks for a password | The key did not land in that account, or has another owner | `ls -la /home/marta/.ssh` from the root session |
| The service sits in `activating (auto-restart)` | The process dies on start | `journalctl -u myapp -n 30` |
| nginx answers `502 Bad Gateway` | The proxy works and the application is not listening | `curl -s localhost:8080/health` |
| Certbot fails the challenge | DNS does not point at this IP, or port 80 is closed | `dig +short your-domain.com` |

## What you just did by hand

Write down how long it took and how many steps had a value only you knew: the user name, the path, the port, the domain. That list is the argument for the modules that follow.

| What you did by hand | What automates it |
| --- | --- |
| Installing the runtime at the right version | [Containers](/en/containers/) |
| Checking that the code works before uploading it | [Continuous integration](/en/integration/) |
| Copying the code and restarting the service | [Deploying from the pipeline](/en/deployment/deploy-from-pipeline/) |
| Accepting a few seconds of downtime on update | [Deployment strategies](/en/deployment/strategies/) |

## Cleanup

If you are going on to the deployment walkthroughs, keep the machine. If not, delete it from the provider's panel: with most of them a powered-off machine keeps billing. Delete the DNS record too, so the name is not left pointing at an IP that will belong to someone else tomorrow.

## Keep exploring

- [Ubuntu Server · documentation](https://ubuntu.com/server/docs) — the official reference for the system you just configured.
- [Certbot · instructions](https://certbot.eff.org/instructions) — the exact steps for your combination of system and proxy.
