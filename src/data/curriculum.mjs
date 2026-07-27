// @ts-check

/**
 * Content taxonomy for the Atlas reference.
 *
 * This file describes *what exists and how it is grouped* — nothing else.
 * There is no progress model: page order inside a module is a suggested
 * reading order, never a gate, and the site stores no reader state.
 *
 * Modules are grouped by the *state of the system* a reader is looking at —
 * one server, containers, automated checks — not by the reader's skill. That
 * is why a module is never called a level: `level` is a per-page field, and a
 * module heading that ranked the reader would imply a gate this site has not
 * got.
 */

/**
 * The taxonomy enums, in one place. `src/content.config.ts` builds its zod
 * enums from these and `scripts/validate-content.mjs` checks against them,
 * so adding a module or a level here is the whole change.
 */
export const MODULE_IDS = /** @type {const} */ ([
  'foundations',
  'collaboration',
  'containers',
  'testing',
  'integration',
  'deployment',
]);
/** Frontmatter `type` values. `overview` is a curriculum kind, not a frontmatter type. */
export const PAGE_TYPES = /** @type {const} */ (['concept', 'tool', 'practice', 'cheatsheet']);
export const LEVELS = /** @type {const} */ (['beginner', 'intermediate', 'advanced']);

/** @typedef {'es' | 'en'} Locale */
/** @typedef {typeof MODULE_IDS[number]} ModuleId */
/** @typedef {'overview' | typeof PAGE_TYPES[number]} PageKind */
/** @typedef {{ es: string, en: string }} LocalizedText */
/**
 * @typedef {Readonly<{
 *   id: string,
 *   module: ModuleId,
 *   order: number,
 *   relativePath: string,
 *   kind: PageKind,
 *   prerequisites: readonly string[],
 *   label: Readonly<LocalizedText>,
 * }>} Page
 */
/**
 * @typedef {Readonly<{
 *   id: ModuleId,
 *   order: number,
 *   label: Readonly<LocalizedText>,
 *   sidebarLabel: Readonly<LocalizedText>,
 *   summary: Readonly<LocalizedText>,
 *   tools: readonly string[],
 *   pages: readonly Page[],
 * }>} Module
 */

/** @param {LocalizedText} value */
const localized = (value) => Object.freeze(value);

/** @param {Omit<Page, 'prerequisites' | 'label'> & { prerequisites: string[], label: LocalizedText }} value */
const page = (value) => Object.freeze({
  ...value,
  prerequisites: Object.freeze(value.prerequisites),
  label: localized(value.label),
});

/** @type {readonly Module[]} */
export const modules = Object.freeze([
  Object.freeze({
    id: 'foundations',
    order: 1,
    label: localized({ es: 'Fundamentos', en: 'Foundations' }),
    sidebarLabel: localized({ es: '01 · Fundamentos', en: '01 · Foundations' }),
    summary: localized({
      es: 'La máquina, la terminal y el recorrido de una petición.',
      en: 'The machine, the terminal, and the path of a request.',
    }),
    tools: Object.freeze(['Linux', 'Bash', 'curl', 'ss']),
    pages: Object.freeze([
      page({
        id: 'foundations.overview', module: 'foundations', order: 1,
        relativePath: 'foundations/', kind: 'overview',
        prerequisites: [], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'foundations.linux', module: 'foundations', order: 2,
        relativePath: 'foundations/linux/', kind: 'concept',
        prerequisites: [], label: { es: 'Linux', en: 'Linux' },
      }),
      page({
        id: 'foundations.terminal', module: 'foundations', order: 3,
        relativePath: 'foundations/terminal/', kind: 'concept',
        prerequisites: ['foundations.linux'], label: { es: 'La terminal', en: 'The terminal' },
      }),
      page({
        id: 'foundations.networking', module: 'foundations', order: 4,
        relativePath: 'foundations/networking/', kind: 'concept',
        prerequisites: ['foundations.terminal'], label: { es: 'Redes esenciales', en: 'Essential networking' },
      }),
      page({
        id: 'foundations.lab-shell-and-network', module: 'foundations', order: 5,
        relativePath: 'foundations/lab-shell-and-network/', kind: 'practice',
        prerequisites: ['foundations.terminal', 'foundations.networking'],
        label: { es: 'Práctica · investigar una aplicación local', en: 'Practice · investigate a local application' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'collaboration',
    order: 2,
    label: localized({ es: 'Colaboración', en: 'Collaboration' }),
    sidebarLabel: localized({ es: '02 · Colaboración', en: '02 · Collaboration' }),
    summary: localized({
      es: 'Convertir cambios individuales en decisiones revisables y compartidas.',
      en: 'Turning individual changes into reviewable, shared decisions.',
    }),
    tools: Object.freeze(['Git', 'GitHub']),
    pages: Object.freeze([
      page({
        id: 'collaboration.overview', module: 'collaboration', order: 6,
        relativePath: 'collaboration/', kind: 'overview',
        prerequisites: ['foundations.terminal'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'collaboration.git-model', module: 'collaboration', order: 7,
        relativePath: 'collaboration/git-model/', kind: 'concept',
        prerequisites: ['foundations.terminal'], label: { es: 'El modelo de Git', en: 'The Git model' },
      }),
      page({
        id: 'collaboration.pull-requests', module: 'collaboration', order: 8,
        relativePath: 'collaboration/pull-requests/', kind: 'tool',
        prerequisites: ['collaboration.git-model'],
        label: { es: 'Pull requests y revisión', en: 'Pull requests and review' },
      }),
      page({
        id: 'collaboration.lab-git-branching', module: 'collaboration', order: 9,
        relativePath: 'collaboration/lab-git-branching/', kind: 'practice',
        prerequisites: ['collaboration.git-model'],
        label: { es: 'Práctica · ramas seguras', en: 'Practice · safe branches' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'containers',
    order: 3,
    label: localized({ es: 'Contenedores', en: 'Containers' }),
    sidebarLabel: localized({ es: '03 · Contenedores', en: '03 · Containers' }),
    summary: localized({
      es: 'Empaquetar la aplicación para que corra igual en cualquier máquina.',
      en: 'Packaging the application so it runs the same on any machine.',
    }),
    tools: Object.freeze(['Docker', 'Docker Compose', 'nginx']),
    pages: Object.freeze([
      page({
        id: 'containers.overview', module: 'containers', order: 10,
        relativePath: 'containers/', kind: 'overview',
        prerequisites: ['collaboration.git-model', 'foundations.networking'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'containers.docker', module: 'containers', order: 11,
        relativePath: 'containers/docker/', kind: 'tool',
        prerequisites: ['foundations.terminal', 'foundations.networking'], label: { es: 'Docker sin magia', en: 'Docker without magic' },
      }),
      page({
        id: 'containers.lab-container-pipeline', module: 'containers', order: 12,
        relativePath: 'containers/lab-container-pipeline/', kind: 'practice',
        prerequisites: ['containers.docker', 'foundations.networking'],
        label: { es: 'Práctica · pipeline local', en: 'Practice · local pipeline' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'testing',
    order: 4,
    label: localized({ es: 'Pruebas', en: 'Testing' }),
    sidebarLabel: localized({ es: '04 · Pruebas', en: '04 · Testing' }),
    summary: localized({
      es: 'Convertir la confianza en evidencia con pruebas automáticas.',
      en: 'Turning confidence into evidence with automated tests.',
    }),
    tools: Object.freeze(['Node.js']),
    pages: Object.freeze([
      page({
        id: 'testing.overview', module: 'testing', order: 13,
        relativePath: 'testing/', kind: 'overview',
        prerequisites: ['collaboration.pull-requests'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'testing.pyramid', module: 'testing', order: 14,
        relativePath: 'testing/pyramid/', kind: 'concept',
        prerequisites: [], label: { es: 'La pirámide de pruebas', en: 'The testing pyramid' },
      }),
      page({
        id: 'testing.lab-first-test', module: 'testing', order: 15,
        relativePath: 'testing/lab-first-test/', kind: 'practice',
        prerequisites: ['testing.pyramid'],
        label: { es: 'Práctica · tu primera prueba', en: 'Practice · your first test' },
      }),
    ]),
  }),
  /*
    Continuous integration is where a branching model finally belongs. "main is
    always deployable" is a claim about the pipeline, not about Git, so the
    strategy page sits next to the workflow that enforces it rather than next to
    the commit graph in Collaboration.
  */
  Object.freeze({
    id: 'integration',
    order: 5,
    label: localized({ es: 'Integración continua', en: 'Continuous integration' }),
    sidebarLabel: localized({ es: '05 · Integración continua', en: '05 · Continuous integration' }),
    summary: localized({
      es: 'Que cada cambio se valide solo, antes de llegar a un servidor.',
      en: 'Every change validated on its own, before it reaches a server.',
    }),
    tools: Object.freeze(['GitHub Actions', 'YAML', 'Git', 'GitHub']),
    pages: Object.freeze([
      page({
        id: 'integration.overview', module: 'integration', order: 16,
        relativePath: 'integration/', kind: 'overview',
        prerequisites: ['collaboration.pull-requests', 'testing.pyramid'],
        label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'integration.github-actions', module: 'integration', order: 17,
        relativePath: 'integration/github-actions/', kind: 'tool',
        prerequisites: ['collaboration.pull-requests'], label: { es: 'GitHub Actions', en: 'GitHub Actions' },
      }),
      page({
        id: 'integration.branching-strategy', module: 'integration', order: 18,
        relativePath: 'integration/branching-strategy/', kind: 'concept',
        prerequisites: ['collaboration.pull-requests'],
        label: { es: 'Estrategias de ramas', en: 'Branching strategies' },
      }),
      page({
        id: 'integration.tests-in-ci', module: 'integration', order: 19,
        relativePath: 'integration/tests-in-ci/', kind: 'tool',
        prerequisites: ['integration.github-actions', 'testing.pyramid'],
        label: { es: 'Pruebas en CI', en: 'Tests in CI' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'deployment',
    order: 6,
    label: localized({ es: 'Despliegue continuo', en: 'Continuous deployment' }),
    sidebarLabel: localized({ es: '06 · Despliegue continuo', en: '06 · Continuous deployment' }),
    summary: localized({
      es: 'Llevar un artefacto a producción y poder revertirlo.',
      en: 'Taking an artifact to production — and being able to roll it back.',
    }),
    tools: Object.freeze(['nginx', 'Caddy', 'Traefik', 'Prometheus']),
    pages: Object.freeze([
      page({
        id: 'deployment.overview', module: 'deployment', order: 20,
        relativePath: 'deployment/', kind: 'overview',
        prerequisites: ['integration.github-actions'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'deployment.pipeline', module: 'deployment', order: 21,
        relativePath: 'deployment/pipeline/', kind: 'concept',
        prerequisites: ['integration.github-actions'], label: { es: 'Del build al release', en: 'From build to release' },
      }),
      page({
        id: 'deployment.proxy', module: 'deployment', order: 22,
        relativePath: 'deployment/proxy/', kind: 'concept',
        prerequisites: ['foundations.networking'],
        label: { es: 'Proxy inverso y balanceo', en: 'Reverse proxy and load balancing' },
      }),
      page({
        id: 'deployment.strategies', module: 'deployment', order: 23,
        relativePath: 'deployment/strategies/', kind: 'concept',
        prerequisites: ['deployment.proxy'], label: { es: 'Estrategias de despliegue', en: 'Deployment strategies' },
      }),
      page({
        id: 'deployment.observability', module: 'deployment', order: 24,
        relativePath: 'deployment/observability/', kind: 'concept',
        prerequisites: ['deployment.proxy'],
        label: { es: 'Observabilidad', en: 'Observability' },
      }),
      page({
        id: 'deployment.lab-release', module: 'deployment', order: 25,
        relativePath: 'deployment/lab-release/', kind: 'practice',
        prerequisites: ['deployment.pipeline'],
        label: { es: 'Práctica · promover y revertir', en: 'Practice · promote and roll back' },
      }),
    ]),
  }),
]);

/** @type {readonly Page[]} */
export const pages = Object.freeze(modules.flatMap((module) => module.pages));

const pagesById = new Map(pages.map((item) => [item.id, item]));
/** @type {Map<string, Module>} */
const modulesById = new Map(modules.map((item) => [item.id, item]));
const pagesByPath = new Map(pages.map((item) => [item.relativePath, item]));

/** @param {string} id @returns {Page | undefined} */
export const getPage = (id) => pagesById.get(id);

/** @param {string} id @returns {Module | undefined} */
export const getModule = (id) => modulesById.get(id);

/**
 * Resolves either locale's URL path to the shared canonical page.
 * @param {string} value
 * @returns {Page | undefined}
 */
export function getPageByPath(value) {
  const pathname = value.split(/[?#]/, 1)[0]
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/^en\//, '')
    .replace(/index(?:\.html)?$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  return pagesByPath.get(`${pathname}/`);
}

/** @param {Page | string} value @param {Locale} locale @returns {string | undefined} */
export function getLocalizedPath(value, locale) {
  const resolved = typeof value === 'string' ? getPage(value) : value;
  if (!resolved) return undefined;
  return `/${locale === 'en' ? 'en/' : ''}${resolved.relativePath}`;
}

/**
 * Suggested reading neighbours across the whole reference. Purely advisory:
 * nothing is locked, and skipping ahead is a supported way to use the site.
 * @param {Page | string} value
 * @returns {{ previous?: Page, next?: Page }}
 */
export function getNeighbours(value) {
  const resolved = typeof value === 'string' ? getPage(value) : value;
  if (!resolved) return {};
  const index = pages.findIndex((item) => item.id === resolved.id);
  return {
    ...(index > 0 ? { previous: pages[index - 1] } : {}),
    ...(index >= 0 && index < pages.length - 1 ? { next: pages[index + 1] } : {}),
  };
}

/**
 * Pages that share at least one tool with the given one, nearest module first.
 * Feeds the "related" links at the foot of a page.
 * @param {Page | string} value
 * @param {Map<string, readonly string[]>} toolsByPageId
 * @returns {readonly Page[]}
 */
export function getRelatedPages(value, toolsByPageId) {
  const resolved = typeof value === 'string' ? getPage(value) : value;
  if (!resolved) return Object.freeze([]);
  const own = new Set((toolsByPageId.get(resolved.id) ?? []).map((tool) => tool.toLowerCase()));
  if (own.size === 0) return Object.freeze([]);
  const scored = pages
    .filter((item) => item.id !== resolved.id)
    .map((item) => {
      const shared = (toolsByPageId.get(item.id) ?? [])
        .filter((tool) => own.has(tool.toLowerCase())).length;
      return { item, shared };
    })
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared
      || Number(b.item.module === resolved.module) - Number(a.item.module === resolved.module)
      || a.item.order - b.item.order);
  return Object.freeze(scored.map((entry) => entry.item));
}
