import type { InventoryItem } from '@/entities/player-progress'
import type { Decoration } from '@/shared/lib/decorations'

import styles from './InventorySlot.module.scss'

type InventorySlotProps = {
  item: InventoryItem
  decoration: Decoration | undefined
  isSelected: boolean
  onToggle: () => void
}

export function InventorySlot({
  item,
  decoration,
  isSelected,
  onToggle,
}: InventorySlotProps) {
  const slotClassName = isSelected
    ? `${styles.slot} ${styles.selected}`
    : styles.slot

  return (
    <button
      type="button"
      className={slotClassName}
      onClick={onToggle}
      aria-pressed={isSelected}
    >
      {decoration?.name ?? `Неизвестное украшение: ${item.decorationId}`}
    </button>
  )
}
