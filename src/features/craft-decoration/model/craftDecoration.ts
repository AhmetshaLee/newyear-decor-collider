import type { PlayerProgress, InventoryItem } from '@/entities/player-progress'
import { calculateCraftCost } from '@/shared/lib/collider/calculateCraftCost'
import type { CraftConfig } from '@/shared/lib/collider/colliderConfig'
import { filterRewardPool, type Decoration } from '@/shared/lib/decorations'

export type CraftDecorationResult =
  | {
      status: 'success'
      progress: PlayerProgress
      item: InventoryItem
      decoration: Decoration
      cost: number
    }
  | {
      status: 'notEnoughShards'
      progress: PlayerProgress
      cost: number
    }
  | {
      status: 'emptyRewardPool'
      progress: PlayerProgress
      cost: number
    }

export type CraftDecorationInput = {
  progress: PlayerProgress
  config: CraftConfig
  decorations: readonly Decoration[]
}

function createInventoryItemId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function pickRandomDecoration(decorations: readonly Decoration[]) {
  const randomIndex = Math.floor(Math.random() * decorations.length)

  return decorations[randomIndex]
}

export function craftDecoration({
  progress,
  config,
  decorations,
}: CraftDecorationInput): CraftDecorationResult {
  const cost = calculateCraftCost(config)

  if (progress.userShards < cost) {
    return {
      status: 'notEnoughShards',
      progress,
      cost,
    }
  }

  const rewardPool = filterRewardPool({
    decorations,
    config,
    unlockedCollectionIds: progress.unlockedCollectionIds,
  })

  if (rewardPool.length === 0) {
    return {
      status: 'emptyRewardPool',
      progress,
      cost,
    }
  }

  const decoration = pickRandomDecoration(rewardPool)

  const item: InventoryItem = {
    id: createInventoryItemId(),
    decorationId: decoration.id,
    timestamp: Date.now(),
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
    status: 'success',
    progress: nextProgress,
    item,
    decoration,
    cost,
  }
}
