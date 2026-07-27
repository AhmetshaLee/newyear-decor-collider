import { getDecorationById } from '@/entities/decoration'
import type {
  PlayerProgress,
  PlayerProgressTransactionResult,
} from '@/entities/player-progress'
import { calculateDecorationRecycleValue } from './recyclePricing'

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
  const selectedEntries = progress.inventory.flatMap((item) => {
    if (!itemIdSet.has(item.id)) return []

    const decoration = getDecorationById(item.decorationId)

    return decoration === undefined ? [] : [{ item, decoration }]
  })

  if (selectedEntries.length === 0) {
    return {
      progress,
      result: {
        status: 'emptySelection',
        recycledItemsCount: 0,
        gainedShards: 0,
      },
    }
  }

  const selectedItemIds = new Set(selectedEntries.map(({ item }) => item.id))
  const gainedShards = selectedEntries.reduce(
    (shards, { decoration }) =>
      shards + calculateDecorationRecycleValue(decoration),
    0,
  )
  const nextProgress: PlayerProgress = {
    ...progress,
    userShards: progress.userShards + gainedShards,
    inventory: progress.inventory.filter(
      (item) => !selectedItemIds.has(item.id),
    ),
  }

  return {
    progress: nextProgress,
    result: {
      status: 'success',
      recycledItemsCount: selectedEntries.length,
      gainedShards,
    },
  }
}
