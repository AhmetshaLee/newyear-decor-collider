import type { CraftConfig } from '@/shared/lib/collider'
import type {
  DecorationAlbum,
  DecorationLevel,
  DecorationType,
} from './decorationValues'

export type RewardPoolDecoration = {
  id: string
  album: DecorationAlbum
  level: DecorationLevel
  type: DecorationType
}

export type FilterRewardPoolInput<Decoration extends RewardPoolDecoration> = {
  decorations: readonly Decoration[]
  config: CraftConfig
  unlockedCollectionIds: readonly string[]
}

export function filterRewardPool<Decoration extends RewardPoolDecoration>({
  decorations,
  config,
  unlockedCollectionIds,
}: FilterRewardPoolInput<Decoration>) {
  const unlockedCollectionIdSet = new Set(unlockedCollectionIds)

  return decorations.filter((decoration) => {
    const matchesAlbum =
      config.album === 'random' || decoration.album === config.album

    const matchesLevel =
      config.level === 'random' || decoration.level === config.level

    const matchesType =
      config.decorationType === 'random' ||
      decoration.type === config.decorationType

    const matchesAntiRepeat =
      config.antiRepeatMode === 'off' ||
      !unlockedCollectionIdSet.has(decoration.id)

    return matchesAlbum && matchesLevel && matchesType && matchesAntiRepeat
  })
}
