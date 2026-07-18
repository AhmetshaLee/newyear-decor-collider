import type { ComponentPropsWithoutRef } from 'react'
import {
  DECORATION_LEVEL_LABELS,
  type DecorationLevel,
} from '@/shared/lib/decorations'

import styles from './DecorationSlot.module.scss'

type DecorationSlotProps = ComponentPropsWithoutRef<'div'> & {
  level?: DecorationLevel
}

export function DecorationSlot({
  children,
  className,
  level,
  ...props
}: DecorationSlotProps) {
  const slotClassName =
    className === undefined ? styles.slot : `${styles.slot} ${className}`

  return (
    <div className={slotClassName} {...props}>
      {level !== undefined && (
        <span className={styles.level} data-decoration-level={level}>
          {DECORATION_LEVEL_LABELS[level]}
        </span>
      )}
      {children}
    </div>
  )
}
