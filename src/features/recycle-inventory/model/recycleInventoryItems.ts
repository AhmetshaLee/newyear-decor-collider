import type {
  PlayerProgress,
  PlayerProgressTransactionResult,
} from '@/entities/player-progress'
import { calculateRecycleShards } from '@/shared/lib/inventory'

export type RecycleInventoryItemsInput = {
  progress: PlayerProgress
  itemIds: readonly string[]
}

export type RecycleInventoryItemsResult =
  | {
      status: 'success'
      recycledItemsCount: number
      gainedShards: number
    }
  | {
      status: 'emptySelection'
      recycledItemsCount: 0
      gainedShards: 0
    }

export function recycleInventoryItems({
  progress,
  itemIds,
}: RecycleInventoryItemsInput): PlayerProgressTransactionResult<RecycleInventoryItemsResult> {
  const itemIdSet = new Set(itemIds)

  const selectedItems = progress.inventory.filter((item) =>
    itemIdSet.has(item.id),
  )

  if (selectedItems.length === 0) {
    return {
      progress,
      result: {
        status: 'emptySelection',
        recycledItemsCount: 0,
        gainedShards: 0,
      },
    }
  }

  const gainedShards = selectedItems.reduce(
    (sum, item) => sum + calculateRecycleShards(item.craftCost),
    0,
  )

  const nextProgress: PlayerProgress = {
    ...progress,
    userShards: progress.userShards + gainedShards,
    inventory: progress.inventory.filter((item) => !itemIdSet.has(item.id)),
  }

  return {
    progress: nextProgress,
    result: {
      status: 'success',
      recycledItemsCount: selectedItems.length,
      gainedShards,
    },
  }
}
