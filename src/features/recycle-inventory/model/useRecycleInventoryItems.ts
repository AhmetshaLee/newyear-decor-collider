import { useCallback } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import {
  recycleInventoryItems,
  type RecycleInventoryItemsResult,
} from './recycleInventoryItems'

type UseRecycleInventoryItemsResult = {
  recycleItems: (itemIds: readonly string[]) => RecycleInventoryItemsResult
}

export function useRecycleInventoryItems(): UseRecycleInventoryItemsResult {
  const { commitProgress } = usePlayerProgress()

  const recycleItems = useCallback(
    (itemIds: readonly string[]) => {
      return commitProgress((currentProgresss) =>
        recycleInventoryItems({
          progress: currentProgresss,
          itemIds,
        }),
      )
    },
    [commitProgress],
  )

  return {
    recycleItems,
  }
}
