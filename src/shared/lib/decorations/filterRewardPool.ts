import type { CraftConfig } from '@/shared/lib/collider'
import type { Decoration } from './decorationsRegistry'

export type FilterRewardPoolInput = {
  decorations: readonly Decoration[]
  config: CraftConfig
  unlockedCollectionIds: readonly string[]
}

export function filterRewardPool({
  decorations,
  config,
  unlockedCollectionIds,
}: FilterRewardPoolInput) {
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
