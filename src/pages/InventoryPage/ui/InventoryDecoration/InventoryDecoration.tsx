import type { Decoration } from '@/shared/lib/decorations'

import styles from './InventoryDecoration.module.scss'

type InventoryDecorationProps = {
  decoration: Decoration | undefined
}

export function InventoryDecoration({ decoration }: InventoryDecorationProps) {
  const name = decoration?.name ?? 'Неизвестное украшение'
  const nameClassName =
    decoration === undefined ? `${styles.name} ${styles.unknown}` : styles.name

  return (
    <span className={styles.decoration}>
      <span className={nameClassName}>{name}</span>
    </span>
  )
}
