import { useMemo, useState } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import {
  DECORATION_ALBUM_VALUES,
  DECORATIONS_REGISTRY,
  type DecorationAlbum,
} from '@/shared/lib/decorations'
import { CollectionGrid } from '../CollectionGrid'
import { CollectionHeader } from '../CollectionHeader'
import { CollectionTabs } from '../CollectionTabs'

import styles from './CollectionPanel.module.scss'

export function CollectionPanel() {
  const { progress } = usePlayerProgress()
  const [selectedAlbum, setSelectedAlbum] = useState<DecorationAlbum>('classic')

  const unlockedDecorationIds = useMemo(() => {
    return new Set(progress.unlockedCollectionIds)
  }, [progress.unlockedCollectionIds])

  const selectedDecorations = DECORATIONS_REGISTRY.filter(
    (decoration) => decoration.album === selectedAlbum,
  )
  const selectedUnlockedCount = selectedDecorations.filter((decoration) =>
    unlockedDecorationIds.has(decoration.id),
  ).length
  const selectedProgressPercent =
    selectedDecorations.length === 0
      ? 0
      : Math.round((selectedUnlockedCount / selectedDecorations.length) * 100)

  const totalDecorationsCount = DECORATIONS_REGISTRY.length
  const totalUnlockedCount = DECORATIONS_REGISTRY.filter((decoration) =>
    unlockedDecorationIds.has(decoration.id),
  ).length

  return (
    <section className={styles.panel}>
      <div className={styles.shell}>
        <div className={styles.albumFrame}>
          <div className={styles.albumCover} />
          <div className={styles.albumPages} />
          <div className={styles.albumBinding}>
            <CollectionHeader
              album={selectedAlbum}
              albumProgressPercent={selectedProgressPercent}
              albumTotalCount={selectedDecorations.length}
              albumUnlockedCount={selectedUnlockedCount}
              totalDecorationsCount={totalDecorationsCount}
              totalUnlockedCount={totalUnlockedCount}
            />
          </div>

          <div className={styles.album}>
            <div className={styles.gridScroller}>
              <CollectionGrid
                decorations={selectedDecorations}
                unlockedDecorationIds={unlockedDecorationIds}
              />
            </div>

            <div className={styles.tabsAnchor}>
              <CollectionTabs
                albums={DECORATION_ALBUM_VALUES}
                selectedAlbum={selectedAlbum}
                onAlbumChange={setSelectedAlbum}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
