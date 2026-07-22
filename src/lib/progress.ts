import { learningSteps, selectLabStep, selectResumeStep } from '../data/learning-path.mjs';

export const PROGRESS_KEY = 'devops-atlas:progress:v1';
export interface ProgressState { version: 1; completed: string[]; lastVisited?: string; }
const validIds = new Set(learningSteps.map((step) => step.id));

export function emptyProgress(): ProgressState { return { version: 1, completed: [] }; }
export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return emptyProgress();
  try {
    const value = JSON.parse(raw) as Partial<ProgressState>;
    if (value.version !== 1 || !Array.isArray(value.completed)) return emptyProgress();
    const completed = [...new Set(value.completed.filter((id): id is string => typeof id === 'string' && validIds.has(id)))];
    const lastVisited = typeof value.lastVisited === 'string' && validIds.has(value.lastVisited) ? value.lastVisited : undefined;
    return { version: 1, completed, ...(lastVisited ? { lastVisited } : {}) };
  } catch { return emptyProgress(); }
}
export function toggleCompleted(state: ProgressState, id: string): ProgressState {
  if (!validIds.has(id)) return state;
  const completed = new Set(state.completed);
  completed.has(id) ? completed.delete(id) : completed.add(id);
  return { ...state, completed: [...completed] };
}
export function resumeId(state: ProgressState) { return selectResumeStep(state)?.id; }
export function labId(state: ProgressState) { return selectLabStep(state)?.id; }
