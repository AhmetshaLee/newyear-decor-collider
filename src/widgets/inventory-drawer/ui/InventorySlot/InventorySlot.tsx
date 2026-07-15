import type { ReactNode } from 'react'
import type { Decoration, DecorationLevel } from '@/shared/lib/decorations'

import styles from './InventorySlot.module.scss'

const LEVEL_LABELS = {
  lvl_1: 'I',
  lvl_2: 'II',
  lvl_3: 'III',
  lvl_4: 'IV',
  lvl_5: 'V',
} satisfies Record<DecorationLevel, string>

type InventorySlotProps = {
  decoration: Decoration | undefined
  isSelected: boolean
  onToggle: () => void
  children: ReactNode
}

export function InventorySlot({
  decoration,
  isSelected,
  onToggle,
  children,
}: InventorySlotProps) {
  const slotClassName = isSelected
    ? `${styles.slot} ${styles.selected}`
    : styles.slot
  const levelLabel =
    decoration === undefined ? '?' : LEVEL_LABELS[decoration.level]
  const name = decoration?.name ?? 'Неизвестное украшение'

  return (
    <button
      type="button"
      className={slotClassName}
      onClick={onToggle}
      title={name}
    >
      <span className={styles.level}>{levelLabel}</span>

      {children}

      <span className={styles.checkmark}>✓</span>
    </button>
  )
}
