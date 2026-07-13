import { ALBUM_OPTIONS } from '@/shared/lib/collider'
import {
  DECORATION_ALBUM_LABELS,
  type DecorationAlbum,
} from '@/shared/lib/decorations'

import styles from './CollectionHeader.module.scss'

type CollectionHeaderProps = {
  album: DecorationAlbum
  albumUnlockedCount: number
  albumTotalCount: number
  albumProgressPercent: number
  totalUnlockedCount: number
  totalDecorationsCount: number
}

export function CollectionHeader({
  album,
  albumUnlockedCount,
  albumTotalCount,
  albumProgressPercent,
  totalUnlockedCount,
  totalDecorationsCount,
}: CollectionHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.albumIdentity}>
        <span className={styles.monogram}>{ALBUM_OPTIONS[album].content}</span>

        <div className={styles.albumInfo}>
          <h1 className={styles.title}>{DECORATION_ALBUM_LABELS[album]}</h1>
          <p className={styles.albumProgress}>
            Собрано: {albumUnlockedCount} / {albumTotalCount} (
            {albumProgressPercent}%)
          </p>
        </div>
      </div>

      <p className={styles.totalProgress}>
        Всего открыто: {totalUnlockedCount} / {totalDecorationsCount}
      </p>
    </header>
  )
}
