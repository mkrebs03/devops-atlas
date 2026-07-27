// @ts-check

/**
 * Display names for every tool slug used in page frontmatter.
 *
 * Frontmatter keeps lowercase slugs so authors never think about casing;
 * this map holds the one official spelling of each project, which is what
 * the A–Z index, the per-page tool chips and the landing cards render.
 * `scripts/validate-content.mjs` rejects any frontmatter slug missing here.
 */

/** @type {Readonly<Record<string, string>>} */
export const toolNames = Object.freeze({
  ansible: 'Ansible',
  apt: 'APT',
  bash: 'Bash',
  caddy: 'Caddy',
  certbot: 'Certbot',
  cron: 'cron',
  curl: 'curl',
  dns: 'DNS',
  docker: 'Docker',
  'docker-compose': 'Docker Compose',
  'docker-swarm': 'Docker Swarm',
  git: 'Git',
  github: 'GitHub',
  'github-actions': 'GitHub Actions',
  http: 'HTTP',
  kubernetes: 'Kubernetes',
  linux: 'Linux',
  nginx: 'nginx',
  node: 'Node.js',
  opentelemetry: 'OpenTelemetry',
  prometheus: 'Prometheus',
  postgresql: 'PostgreSQL',
  python: 'Python',
  redis: 'Redis',
  rsync: 'rsync',
  s3: 'Amazon S3',
  ss: 'ss',
  ssh: 'SSH',
  systemd: 'systemd',
  terraform: 'Terraform',
  tls: 'TLS',
  traefik: 'Traefik',
  ufw: 'ufw',
  yaml: 'YAML',
});
