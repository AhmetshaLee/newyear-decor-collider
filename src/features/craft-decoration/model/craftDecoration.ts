import type {
  PlayerProgress,
  InventoryItem,
  PlayerProgressTransactionResult,
} from '@/entities/player-progress'
import { calculateCraftCost, type CraftConfig } from '@/shared/lib/collider'
import { filterRewardPool, type Decoration } from '@/shared/lib/decorations'

export type CraftDecorationResult =
  | {
      status: 'success'
      item: InventoryItem
      decoration: Decoration
      cost: number
    }
  | {
      status: 'notEnoughShards'
      cost: number
    }
  | {
      status: 'emptyRewardPool'
      cost: number
    }

export type CraftDecorationAttempt = {
  itemId: string
  timestamp: number
  randomValue: number
}

export type CraftDecorationInput = {
  progress: PlayerProgress
  config: CraftConfig
  decorations: readonly Decoration[]
  attempt: CraftDecorationAttempt
}

function createInventoryItemId(timestamp: number, randomValue: number) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${timestamp}-${randomValue.toString(36).slice(2)}`
}

export function createCraftDecorationAttempt(): CraftDecorationAttempt {
  const timestamp = Date.now()
  const randomValue = Math.random()

  return {
    itemId: createInventoryItemId(timestamp, randomValue),
    timestamp,
    randomValue,
  }
}

function pickRandomDecoration(
  decorations: readonly Decoration[],
  randomValue: number,
) {
  const randomIndex = Math.max(
    0,
    Math.min(
      Math.floor(randomValue * decorations.length),
      decorations.length - 1,
    ),
  )

  return decorations[randomIndex]
}

export function craftDecoration({
  progress,
  config,
  decorations,
  attempt,
}: CraftDecorationInput): PlayerProgressTransactionResult<CraftDecorationResult> {
  const cost = calculateCraftCost(config)

  if (progress.userShards < cost) {
    return {
      progress,
      result: {
        status: 'notEnoughShards',
        cost,
      },
    }
  }

  const rewardPool = filterRewardPool({
    decorations,
    config,
    unlockedCollectionIds: progress.unlockedCollectionIds,
  })

  if (rewardPool.length === 0) {
    return {
      progress,
      result: {
        status: 'emptyRewardPool',
        cost,
      },
    }
  }

  const decoration = pickRandomDecoration(rewardPool, attempt.randomValue)

  const item: InventoryItem = {
    id: attempt.itemId,
    decorationId: decoration.id,
    timestamp: attempt.timestamp,
    craftCost: cost,
  }

  const isAlreadyUnlocked = progress.unlockedCollectionIds.includes(
    decoration.id,
  )

  const nextProgress: PlayerProgress = {
    ...progress,
    userShards: progress.userShards - cost,
    inventory: [...progress.inventory, item],
    unlockedCollectionIds: isAlreadyUnlocked
      ? progress.unlockedCollectionIds
      : [...progress.unlockedCollectionIds, decoration.id],
  }

  return {
    progress: nextProgress,
    result: {
      status: 'success',
      item,
      decoration,
      cost,
    },
  }
}
