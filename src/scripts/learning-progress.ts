import { getLearningStep, getLocalizedStepPath, learningSteps } from '../data/learning-path.mjs';
import { emptyProgress, labId, parseProgress, PROGRESS_KEY, resumeId, toggleCompleted, type ProgressState } from '../lib/progress';

function storageAvailable() {
  try { localStorage.setItem(`${PROGRESS_KEY}:probe`, '1'); localStorage.removeItem(`${PROGRESS_KEY}:probe`); return true; } catch { return false; }
}
function read(): ProgressState { try { return parseProgress(localStorage.getItem(PROGRESS_KEY)); } catch { return emptyProgress(); } }
function write(state: ProgressState) { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state)); return true; } catch { return false; } }
function localeOf(root: Element): 'es' | 'en' { return root.getAttribute('data-locale') === 'en' || location.pathname.startsWith('/en/') ? 'en' : 'es'; }

function render(state: ProgressState) {
  const completed = new Set(state.completed);
  document.querySelectorAll<HTMLElement>('[data-progress-step]').forEach((node) => {
    const id = node.dataset.progressStep!;
    const current = state.lastVisited === id && !completed.has(id);
    node.dataset.progressState = completed.has(id) ? 'completed' : current ? 'current' : 'pending';
    const status = node.querySelector<HTMLElement>('[data-progress-status]');
    if (status) {
      const stateName = completed.has(id) ? 'completed' : current ? 'current' : 'pending';
      const label = status.dataset[`label${stateName[0].toUpperCase()}${stateName.slice(1)}` as keyof DOMStringMap];
      status.textContent = label ?? (completed.has(id) ? '✓' : current ? '→' : '○');
    }
  });
  document.querySelectorAll<HTMLElement>('[data-progress-summary]').forEach((summary) => {
    const moduleId = summary.dataset.progressModule;
    const relevant = moduleId ? learningSteps.filter((step) => step.module === moduleId) : learningSteps;
    const count = relevant.filter((step) => completed.has(step.id)).length;
    const percent = Math.round((count / relevant.length) * 100);
    summary.style.setProperty('--atlas-progress', `${percent}%`);
    const locale = localeOf(summary);
    const countEl = summary.querySelector<HTMLElement>('[data-progress-count]');
    const percentEl = summary.querySelector<HTMLElement>('[data-progress-percent]');
    if (countEl) countEl.textContent = locale === 'en' ? `${count} of ${relevant.length} completed` : `${count} de ${relevant.length} completadas`;
    if (percentEl) percentEl.textContent = `${percent}%`;
  });
  document.querySelectorAll<HTMLElement>('[data-course-percent]').forEach((el) => { el.textContent = `${Math.round(completed.size / learningSteps.length * 100)}%`; });
  document.querySelectorAll<HTMLButtonElement>('[data-progress-control]').forEach((button) => {
    const done = completed.has(button.dataset.progressControl!);
    button.textContent = done ? button.dataset.labelUndo! : button.dataset.labelComplete!;
  });
  document.querySelectorAll<HTMLElement>('[data-learning-progress]').forEach((root) => {
    const locale = localeOf(root);
    const targetId = resumeId(state);
    root.querySelectorAll<HTMLAnchorElement>('[data-resume-link]').forEach((link) => {
      if (targetId) link.href = getLocalizedStepPath(targetId, locale)!; else link.href = `${locale === 'en' ? '/en/' : '/'}#learning-path`;
      const label = link.querySelector<HTMLElement>('[data-resume-label]');
      if (label && link.dataset.labelStart) label.textContent = completed.size === 0 ? link.dataset.labelStart : targetId ? link.dataset.labelContinue! : link.dataset.labelReview!;
    });
    const nextLab = labId(state); const lab = root.querySelector<HTMLAnchorElement>('[data-lab-link]');
    if (lab && nextLab) lab.href = getLocalizedStepPath(nextLab, locale)!;
  });
  document.querySelectorAll<HTMLElement>('[data-progress-personalized]').forEach((el) => { el.hidden = false; });
}

export function initLearningProgress() {
  if (document.documentElement.dataset.learningProgressReady === 'true') { render(read()); return; }
  if (!storageAvailable()) return;
  document.documentElement.dataset.learningProgressReady = 'true';
  let state = read();
  const current = document.querySelector<HTMLElement>('[data-current-step]')?.dataset.currentStep;
  if (current && getLearningStep(current) && state.lastVisited !== current) { state = { ...state, lastVisited: current }; write(state); }
  document.querySelectorAll<HTMLButtonElement>('[data-progress-control]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const id = button.dataset.progressControl!; state = toggleCompleted(read(), id); state.lastVisited = id;
      if (write(state)) { render(state); button.textContent = state.completed.includes(id) ? button.dataset.labelUndo! : button.dataset.labelComplete!; window.dispatchEvent(new CustomEvent('atlas:progress-change')); }
    });
  });
  window.addEventListener('atlas:progress-change', () => render(read()));
  render(state);
}
