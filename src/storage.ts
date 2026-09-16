import type { AppState } from './types'

const STORAGE_KEY = 'deep-flow:state:v1'

const EMPTY_STATE: AppState = { goals: [], sessions: [] }

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return EMPTY_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    }
  } catch {
    return EMPTY_STATE
  }
}

export function saveState(state: AppState): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore persistence errors (e.g. private mode quota limits).
  }
}
