import { useCallback } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import { DECORATIONS_REGISTRY } from '@/entities/decoration'
import type { CraftRecipe } from './craftRecipe'
import {
  craftDecoration,
  createCraftDecorationAttempt,
  type CraftDecorationResult,
} from './craftDecoration'

type UseCraftDecorationResult = {
  createDecoration: (recipe: CraftRecipe) => CraftDecorationResult
}

export function useCraftDecoration(): UseCraftDecorationResult {
  const { commitProgress } = usePlayerProgress()

  const createDecoration = useCallback(
    (recipe: CraftRecipe) => {
      const attempt = createCraftDecorationAttempt()

      return commitProgress((currentProgress) =>
        craftDecoration({
          progress: currentProgress,
          recipe,
          decorations: DECORATIONS_REGISTRY,
          attempt,
        }),
      )
    },
    [commitProgress],
  )

  return {
    createDecoration,
  }
}
