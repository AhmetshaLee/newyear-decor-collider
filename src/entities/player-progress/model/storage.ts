import { INITIAL_PLAYER_PROGRESS } from './initialPlayerProgress'
import type { PlayerProgress } from './types'

const PLAYER_PROGRESS_STORAGE_KEY = 'newyear-decor-collider:player-progress'

export function loadPlayerProgress(): PlayerProgress {
  const rawProgress = localStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY)

  if (rawProgress === null) return INITIAL_PLAYER_PROGRESS

  try {
    return JSON.parse(rawProgress)
  } catch {
    return INITIAL_PLAYER_PROGRESS
  }
}

export function savePlayerProgress(progress: PlayerProgress) {
  localStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
}
