import { useContext } from 'react'
import { PlayerProgressContext } from './PlayerProgressContext'

export function usePlayerProgress() {
  const context = useContext(PlayerProgressContext)

  if (context === null) {
    throw new Error(
      'usePlayerProgress должен использоваться внутри PlayerProgressProvider',
    )
  }

  return context
}
