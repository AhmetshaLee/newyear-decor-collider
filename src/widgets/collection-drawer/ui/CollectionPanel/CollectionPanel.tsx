import { useMemo, useState } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import { ALBUM_OPTIONS } from '@/shared/lib/collider'
import {
  DECORATION_ALBUM_VALUES,
  DECORATION_ALBUM_LABELS,
  DECORATIONS_REGISTRY,
  type DecorationAlbum,
} from '@/shared/lib/decorations'
import { CollectionDecoration } from '../CollectionDecoration'
import { CollectionSlot } from '../CollectionSlot'

import styles from './CollectionPanel.module.scss'

type CollectionPanelProps = {
  onClose: () => void
}

export function CollectionPanel({ onClose }: CollectionPanelProps) {
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
      <header className={styles.header}>
        <div className={styles.info}>
          <h2 className={styles.title}>Коллекция</h2>
          <span className={styles.albumName}>
            {DECORATION_ALBUM_LABELS[selectedAlbum]}
          </span>
          <span>
            Альбом: {selectedUnlockedCount} / {selectedDecorations.length} (
            {selectedProgressPercent}%)
          </span>
          <span>
            Всего: {totalUnlockedCount} / {totalDecorationsCount}
          </span>
        </div>

        <div className={styles.actions}>
          <div className={styles.tabs}>
            {DECORATION_ALBUM_VALUES.map((album) => {
              const isActive = album === selectedAlbum
              const tabClassName = isActive
                ? `${styles.tab} ${styles.active}`
                : styles.tab

              return (
                <button
                  className={tabClassName}
                  key={album}
                  title={DECORATION_ALBUM_LABELS[album]}
                  type="button"
                  onClick={() => setSelectedAlbum(album)}
                >
                  {ALBUM_OPTIONS[album].content}
                </button>
              )
            })}
          </div>

          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {selectedDecorations.length === 0 ? (
          <p className={styles.emptyState}>
            В этом альбоме пока нет утвержденных украшений.
          </p>
        ) : (
          <div className={styles.grid}>
            {selectedDecorations.map((decoration) => {
              const isUnlocked = unlockedDecorationIds.has(decoration.id)

              return (
                <CollectionSlot
                  isUnlocked={isUnlocked}
                  key={decoration.id}
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
        )}
      </div>

      <footer className={styles.footer} />
    </section>
  )
}
