import { ALBUM_OPTIONS } from '@/shared/lib/collider'
import {
  DECORATION_ALBUM_LABELS,
  type DecorationAlbum,
} from '@/shared/lib/decorations'

import styles from './CollectionTabs.module.scss'

type CollectionTabsProps = {
  albums: readonly DecorationAlbum[]
  selectedAlbum: DecorationAlbum
  onAlbumChange: (album: DecorationAlbum) => void
}

export function CollectionTabs({
  albums,
  selectedAlbum,
  onAlbumChange,
}: CollectionTabsProps) {
  return (
    <nav className={styles.tabs}>
      {albums.map((album) => {
        const isActive = album === selectedAlbum
        const tabClassName = isActive
          ? `${styles.tab} ${styles.active}`
          : styles.tab

        return (
          <button
            key={album}
            type="button"
            className={tabClassName}
            onClick={() => onAlbumChange(album)}
            title={DECORATION_ALBUM_LABELS[album]}
          >
            {ALBUM_OPTIONS[album].content}
          </button>
        )
      })}
    </nav>
  )
}
