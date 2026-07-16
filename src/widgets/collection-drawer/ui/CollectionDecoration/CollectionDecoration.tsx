import type { Decoration, DecorationLevel } from '@/shared/lib/decorations'

import styles from './CollectionDecoration.module.scss'

const LEVEL_LABELS = {
  lvl_1: 'I',
  lvl_2: 'II',
  lvl_3: 'III',
  lvl_4: 'IV',
  lvl_5: 'V',
} satisfies Record<DecorationLevel, string>

type CollectionDecorationProps = {
  decoration: Decoration
  isUnlocked: boolean
}

export function CollectionDecoration({
  decoration,
  isUnlocked,
}: CollectionDecorationProps) {
  const className = isUnlocked
    ? `${styles.decoration} ${styles.unlocked}`
    : `${styles.decoration} ${styles.locked}`

  return (
    <span className={className}>
      <span className={styles.preview}>{decoration.name.slice(0, 1)}</span>
      <span className={styles.name}>{decoration.name}</span>
      <span className={styles.level}>{LEVEL_LABELS[decoration.level]}</span>
    </span>
  )
}
