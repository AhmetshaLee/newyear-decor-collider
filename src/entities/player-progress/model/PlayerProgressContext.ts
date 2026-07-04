import { createContext } from 'react'
import type { PlayerProgress } from './types'

export type PlayerProgressTransactionResult<TResult> = {
  progress: PlayerProgress
  result: TResult
}

export type PlayerProgressTransaction<TResult> = (
  currentProgress: PlayerProgress,
) => PlayerProgressTransactionResult<TResult>

export type PlayerProgressContextValue = {
  progress: PlayerProgress
  commitProgress: <TResult>(
    transaction: PlayerProgressTransaction<TResult>,
  ) => TResult
}

export const PlayerProgressContext =
  createContext<PlayerProgressContextValue | null>(null)
