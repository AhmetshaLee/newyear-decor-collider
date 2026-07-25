import type { Decoration } from '@/entities/decoration'
import type { CraftRecipe } from './craftRecipe'

export type FilterRewardPoolInput = {
  decorations: readonly Decoration[]
  recipe: CraftRecipe
  unlockedCollectionIds: readonly string[]
}

export function filterRewardPool({
  decorations,
  recipe,
  unlockedCollectionIds,
}: FilterRewardPoolInput): Decoration[] {
  const unlockedCollectionIdSet = new Set(unlockedCollectionIds)

  return decorations.filter((decoration) => {
    const matchesAlbum =
      recipe.album === 'random' || decoration.album === recipe.album

    const matchesLevel =
      recipe.level === 'random' || decoration.level === recipe.level

    const matchesType =
      recipe.decorationType === 'random' ||
      decoration.type === recipe.decorationType

    const matchesAntiRepeat =
      recipe.antiRepeatMode === 'off' ||
      !unlockedCollectionIdSet.has(decoration.id)

    return matchesAlbum && matchesLevel && matchesType && matchesAntiRepeat
  })
}
