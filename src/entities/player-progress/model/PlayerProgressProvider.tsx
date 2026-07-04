import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { loadPlayerProgress, savePlayerProgress } from './storage'
import {
  PlayerProgressContext,
  type PlayerProgressTransaction,
} from './PlayerProgressContext'

type PlayerProgressProviderProps = {
  children: ReactNode
}

export function PlayerProgressProvider({
  children,
}: PlayerProgressProviderProps) {
  const [progress, setProgress] = useState(loadPlayerProgress)
  const progressRef = useRef(progress)

  const commitProgress = useCallback(
    <TResult,>(transaction: PlayerProgressTransaction<TResult>) => {
      const currentProgress = progressRef.current
      const transactionResult = transaction(currentProgress)
      const nextProgress = transactionResult.progress

      if (nextProgress !== currentProgress) {
        progressRef.current = nextProgress
        setProgress(nextProgress)
        savePlayerProgress(nextProgress)
      }

      return transactionResult.result
    },
    [],
  )

  const value = useMemo(
    () => ({
      progress,
      commitProgress,
    }),
    [progress, commitProgress],
  )

  return (
    <PlayerProgressContext.Provider value={value}>
      {children}
    </PlayerProgressContext.Provider>
  )
}
