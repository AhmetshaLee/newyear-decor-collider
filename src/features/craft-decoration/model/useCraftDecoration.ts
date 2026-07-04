import { useCallback } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import type { CraftConfig } from '@/shared/lib/collider/colliderConfig'
import { DECORATIONS_REGISTRY } from '@/shared/lib/decorations'
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

      return commitProgress((currentProgress) => {
        const result = craftDecoration({
          progress: currentProgress,
          config,
          decorations: DECORATIONS_REGISTRY,
          attempt,
        })

        return {
          progress:
            result.status === 'success' ? result.progress : currentProgress,
          result,
        }
      })
    },
    [commitProgress],
  )

  return {
    createDecoration,
  }
}
