import type { Decoration } from '@/shared/lib/decorations'
import { CollectionDecoration } from '../CollectionDecoration'
import { CollectionSlot } from '../CollectionSlot'

import styles from './CollectionGrid.module.scss'

type CollectionGridProps = {
  decorations: readonly Decoration[]
  unlockedDecorationIds: ReadonlySet<string>
}

export function CollectionGrid({
  decorations,
  unlockedDecorationIds,
}: CollectionGridProps) {
  if (decorations.length === 0) {
    return (
      <p className={styles.emptyState}>
        В этом альбоме пока нет утвержденных украшений.
      </p>
    )
  }

  return (
    <div className={styles.grid}>
      {decorations.map((decoration) => {
        const isUnlocked = unlockedDecorationIds.has(decoration.id)

        return (
          <CollectionSlot
            key={decoration.id}
            isUnlocked={isUnlocked}
            title={decoration.name}
          >
            <CollectionDecoration
              decoration={decoration}
              isUnlocked={isUnlocked}
            />
          </CollectionSlot>
        )
      })}
    </div>
  )
}
