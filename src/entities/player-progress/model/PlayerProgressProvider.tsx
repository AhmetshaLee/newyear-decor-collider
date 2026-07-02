import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadPlayerProgress, savePlayerProgress } from './storage'
import { PlayerProgressContext } from './PlayerProgressContext'

type PlayerProgressProviderProps = {
  children: ReactNode
}

export function PlayerProgressProvider({
  children,
}: PlayerProgressProviderProps) {
  const [progress, setProgress] = useState(loadPlayerProgress)

  const value = useMemo(
    () => ({
      progress,
      setProgress,
    }),
    [progress],
  )

  useEffect(() => {
    savePlayerProgress(progress)
  }, [progress])

  return (
    <PlayerProgressContext.Provider value={value}>
      {children}
    </PlayerProgressContext.Provider>
  )
}
