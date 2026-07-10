import { INITIAL_PLAYER_PROGRESS } from './initialPlayerProgress'
import type { PlayerProgress } from './types'

const PLAYER_PROGRESS_STORAGE_KEY = 'newyear-decor-collider:player-progress'

function restoreInitialPlayerProgress(): PlayerProgress {
  savePlayerProgress(INITIAL_PLAYER_PROGRESS)

  return INITIAL_PLAYER_PROGRESS
}

export function loadPlayerProgress(): PlayerProgress {
  const rawProgress = localStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY)

  if (rawProgress === null) return restoreInitialPlayerProgress()

  try {
    return JSON.parse(rawProgress)
  } catch {
    return restoreInitialPlayerProgress()
  }
}

export function savePlayerProgress(progress: PlayerProgress) {
  localStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
}
