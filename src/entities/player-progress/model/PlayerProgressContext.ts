import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { PlayerProgress } from './types'

type PlayerProgressContextValue = {
  progress: PlayerProgress
  setProgress: Dispatch<SetStateAction<PlayerProgress>>
}

export const PlayerProgressContext =
  createContext<PlayerProgressContextValue | null>(null)
