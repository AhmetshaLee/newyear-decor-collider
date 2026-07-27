import type {
  PlayerProgress,
  InventoryItem,
  PlayerProgressTransactionResult,
} from '@/entities/player-progress'
import type { Decoration } from '@/entities/decoration'
import { calculateCraftCost } from './craftPricing'
import type { CraftRecipe } from './craftRecipe'
import { filterRewardPool } from './filterRewardPool'
import {
  pickRandomCraftDecoration,
  pickWeightedCraftDecoration,
} from './pickCraftDecoration'

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
  levelRandomValue: number
  decorationRandomValue: number
}

export type CraftDecorationInput = {
  progress: PlayerProgress
  recipe: CraftRecipe
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
  const levelRandomValue = Math.random()
  const decorationRandomValue = Math.random()

  return {
    itemId: createInventoryItemId(timestamp, decorationRandomValue),
    timestamp,
    levelRandomValue,
    decorationRandomValue,
  }
}

export function craftDecoration({
  progress,
  recipe,
  decorations,
  attempt,
}: CraftDecorationInput): PlayerProgressTransactionResult<CraftDecorationResult> {
  const cost = calculateCraftCost(recipe)

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
    recipe,
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

  const decoration =
    recipe.level === 'random'
      ? pickWeightedCraftDecoration(
          rewardPool,
          attempt.levelRandomValue,
          attempt.decorationRandomValue,
        )
      : pickRandomCraftDecoration(rewardPool, attempt.decorationRandomValue)

  const item: InventoryItem = {
    id: attempt.itemId,
    decorationId: decoration.id,
    timestamp: attempt.timestamp,
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
