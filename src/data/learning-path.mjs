// @ts-check

/** @typedef {'es' | 'en'} LearningLocale */
/** @typedef {'foundations' | 'collaboration' | 'delivery' | 'testing'} LearningModuleId */
/** @typedef {'overview' | 'concept' | 'tool' | 'lab'} LearningStepKind */
/** @typedef {{ es: string, en: string }} LocalizedText */
/**
 * @typedef {Readonly<{
 *   id: string,
 *   module: LearningModuleId,
 *   order: number,
 *   relativePath: string,
 *   kind: LearningStepKind,
 *   minutes: number,
 *   prerequisites: readonly string[],
 *   label: Readonly<LocalizedText>,
 * }>} LearningStep
 */
/**
 * @typedef {Readonly<{
 *   id: LearningModuleId,
 *   order: number,
 *   label: Readonly<LocalizedText>,
 *   sidebarLabel: Readonly<LocalizedText>,
 *   outcome: Readonly<LocalizedText>,
 *   steps: readonly LearningStep[],
 * }>} LearningModule
 */
/** @typedef {{ completed?: readonly string[], lastVisited?: string }} LearningProgress */

/** @param {LocalizedText} value */
const localized = (value) => Object.freeze(value);

/** @param {Omit<LearningStep, 'prerequisites' | 'label'> & { prerequisites: string[], label: LocalizedText }} value */
const step = (value) => Object.freeze({
  ...value,
  prerequisites: Object.freeze(value.prerequisites),
  label: localized(value.label),
});

/** @type {readonly LearningModule[]} */
export const learningModules = Object.freeze([
  Object.freeze({
    id: 'foundations',
    order: 1,
    label: localized({ es: 'Fundamentos', en: 'Foundations' }),
    sidebarLabel: localized({ es: '01 · Fundamentos', en: '01 · Foundations' }),
    outcome: localized({
      es: 'Comprende la máquina, la terminal y el recorrido de una petición.',
      en: 'Understand the machine, the terminal, and the path of a request.',
    }),
    steps: Object.freeze([
      step({
        id: 'foundations.overview', module: 'foundations', order: 1,
        relativePath: 'foundations/', kind: 'overview', minutes: 10,
        prerequisites: [], label: { es: 'Panorama', en: 'Overview' },
      }),
      step({
        id: 'foundations.linux-cli', module: 'foundations', order: 2,
        relativePath: 'foundations/linux-cli/', kind: 'concept', minutes: 30,
        prerequisites: [], label: { es: 'Linux y terminal', en: 'Linux and terminal' },
      }),
      step({
        id: 'foundations.networking', module: 'foundations', order: 3,
        relativePath: 'foundations/networking/', kind: 'concept', minutes: 35,
        prerequisites: ['foundations.linux-cli'], label: { es: 'Redes esenciales', en: 'Essential networking' },
      }),
      step({
        id: 'foundations.lab-shell-and-network', module: 'foundations', order: 4,
        relativePath: 'foundations/lab-shell-and-network/', kind: 'lab', minutes: 25,
        prerequisites: ['foundations.linux-cli', 'foundations.networking'],
        label: { es: 'Lab · shell y red', en: 'Lab · shell and network' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'collaboration',
    order: 2,
    label: localized({ es: 'Colaboración', en: 'Collaboration' }),
    sidebarLabel: localized({ es: '02 · Colaboración', en: '02 · Collaboration' }),
    outcome: localized({
      es: 'Convierte cambios individuales en decisiones revisables y compartidas.',
      en: 'Turn individual changes into reviewable, shared decisions.',
    }),
    steps: Object.freeze([
      step({
        id: 'collaboration.overview', module: 'collaboration', order: 5,
        relativePath: 'collaboration/', kind: 'overview', minutes: 10,
        prerequisites: ['foundations.linux-cli'], label: { es: 'Panorama', en: 'Overview' },
      }),
      step({
        id: 'collaboration.git-model', module: 'collaboration', order: 6,
        relativePath: 'collaboration/git-model/', kind: 'concept', minutes: 35,
        prerequisites: ['foundations.linux-cli'], label: { es: 'El modelo de Git', en: 'The Git model' },
      }),
      step({
        id: 'collaboration.github-flow', module: 'collaboration', order: 7,
        relativePath: 'collaboration/github-flow/', kind: 'tool', minutes: 30,
        prerequisites: ['collaboration.git-model'], label: { es: 'GitHub Flow', en: 'GitHub Flow' },
      }),
      step({
        id: 'collaboration.lab-git-branching', module: 'collaboration', order: 8,
        relativePath: 'collaboration/lab-git-branching/', kind: 'lab', minutes: 25,
        prerequisites: ['collaboration.git-model'], label: { es: 'Lab · ramas seguras', en: 'Lab · safe branches' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'delivery',
    order: 3,
    label: localized({ es: 'Entrega', en: 'Delivery' }),
    sidebarLabel: localized({ es: '03 · Entrega', en: '03 · Delivery' }),
    outcome: localized({
      es: 'Empaqueta, automatiza y verifica cambios con confianza.',
      en: 'Package, automate, and verify changes with confidence.',
    }),
    steps: Object.freeze([
      step({
        id: 'delivery.overview', module: 'delivery', order: 9,
        relativePath: 'delivery/', kind: 'overview', minutes: 10,
        prerequisites: ['collaboration.git-model', 'foundations.networking'], label: { es: 'Panorama', en: 'Overview' },
      }),
      step({
        id: 'delivery.docker', module: 'delivery', order: 10,
        relativePath: 'delivery/docker/', kind: 'tool', minutes: 40,
        prerequisites: ['foundations.linux-cli', 'foundations.networking'], label: { es: 'Docker sin magia', en: 'Docker without magic' },
      }),
      step({
        id: 'delivery.github-actions', module: 'delivery', order: 11,
        relativePath: 'delivery/github-actions/', kind: 'tool', minutes: 35,
        prerequisites: ['collaboration.github-flow'], label: { es: 'GitHub Actions', en: 'GitHub Actions' },
      }),
      step({
        id: 'delivery.lab-container-pipeline', module: 'delivery', order: 12,
        relativePath: 'delivery/lab-container-pipeline/', kind: 'lab', minutes: 35,
        prerequisites: ['delivery.docker', 'foundations.networking'], label: { es: 'Lab · pipeline local', en: 'Lab · local pipeline' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'testing',
    order: 4,
    label: localized({ es: 'Pruebas', en: 'Testing' }),
    sidebarLabel: localized({ es: '04 · Pruebas', en: '04 · Testing' }),
    outcome: localized({
      es: 'Convierte la confianza en evidencia con pruebas automáticas y feedback rápido.',
      en: 'Turn confidence into evidence with automated tests and fast feedback.',
    }),
    steps: Object.freeze([
      step({
        id: 'testing.overview', module: 'testing', order: 13,
        relativePath: 'testing/', kind: 'overview', minutes: 10,
        prerequisites: ['collaboration.github-flow'], label: { es: 'Panorama', en: 'Overview' },
      }),
      step({
        id: 'testing.pyramid', module: 'testing', order: 14,
        relativePath: 'testing/pyramid/', kind: 'concept', minutes: 30,
        prerequisites: ['foundations.linux-cli'], label: { es: 'La pirámide de pruebas', en: 'The testing pyramid' },
      }),
      step({
        id: 'testing.in-ci', module: 'testing', order: 15,
        relativePath: 'testing/in-ci/', kind: 'tool', minutes: 30,
        prerequisites: ['delivery.github-actions'], label: { es: 'Pruebas en CI', en: 'Tests in CI' },
      }),
      step({
        id: 'testing.lab-first-test', module: 'testing', order: 16,
        relativePath: 'testing/lab-first-test/', kind: 'lab', minutes: 25,
        prerequisites: ['testing.pyramid'], label: { es: 'Lab · tu primera prueba', en: 'Lab · your first test' },
      }),
    ]),
  }),
]);

/** @type {readonly LearningStep[]} */
export const learningSteps = Object.freeze(learningModules.flatMap((module) => module.steps));

const stepsById = new Map(learningSteps.map((item) => [item.id, item]));
/** @type {Map<string, LearningModule>} */
const modulesById = new Map(learningModules.map((item) => [item.id, item]));
const stepsByPath = new Map(learningSteps.map((item) => [item.relativePath, item]));

/** @param {string} id @returns {LearningStep | undefined} */
export const getLearningStep = (id) => stepsById.get(id);

/** @param {string} id @returns {LearningModule | undefined} */
export const getLearningModule = (id) => modulesById.get(id);

/**
 * Resolves either locale's URL path to the shared canonical step.
 * @param {string} value
 * @returns {LearningStep | undefined}
 */
export function getLearningStepByPath(value) {
  const pathname = value.split(/[?#]/, 1)[0]
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/^en\//, '')
    .replace(/index(?:\.html)?$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  return stepsByPath.get(`${pathname}/`);
}

/** @param {LearningStep | string} value @param {LearningLocale} locale */
export function getLocalizedStepPath(value, locale) {
  const resolved = typeof value === 'string' ? getLearningStep(value) : value;
  if (!resolved) return undefined;
  return `/${locale === 'en' ? 'en/' : ''}${resolved.relativePath}`;
}

/**
 * Returns the shared resume target, or `undefined` when the route is complete.
 * @param {LearningProgress} [progress]
 * @returns {LearningStep | undefined}
 */
export function selectResumeStep(progress = {}) {
  const completed = new Set((progress.completed ?? []).filter((id) => stepsById.has(id)));
  const lastVisited = progress.lastVisited ? stepsById.get(progress.lastVisited) : undefined;

  if (lastVisited && !completed.has(lastVisited.id)) return lastVisited;
  if (lastVisited) {
    const laterIncomplete = learningSteps.find(
      (item) => item.order > lastVisited.order && !completed.has(item.id),
    );
    if (laterIncomplete) return laterIncomplete;
  }
  return learningSteps.find((item) => !completed.has(item.id));
}

/** @param {LearningProgress} [progress] @returns {LearningStep} */
export function selectLabStep(progress = {}) {
  const completed = new Set((progress.completed ?? []).filter((id) => stepsById.has(id)));
  const labs = learningSteps.filter((item) => item.kind === 'lab');
  return labs.find((item) => !completed.has(item.id)) ?? labs[0];
}
