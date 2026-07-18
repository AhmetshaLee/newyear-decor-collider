import { useCallback } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import { DECORATIONS_REGISTRY } from '@/entities/decoration'
import type { CraftConfig } from '@/shared/lib/collider'
import {
  craftDecoration,
  createCraftDecorationAttempt,
  type CraftDecorationResult,
} from './craftDecoration'

type UseCraftDecorationResult = {
  createDecoration: (config: CraftConfig) => CraftDecorationResult
}

export function useCraftDecoration(): UseCraftDecorationResult {
  const { commitProgress } = usePlayerProgress()

  const createDecoration = useCallback(
    (config: CraftConfig) => {
      const attempt = createCraftDecorationAttempt()

      return commitProgress((currentProgress) =>
        craftDecoration({
          progress: currentProgress,
          config,
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
