import type { ReactNode } from 'react'

import styles from './CollectionSlot.module.scss'

type CollectionSlotProps = {
  isUnlocked: boolean
  title: string
  children: ReactNode
}

export function CollectionSlot({
  isUnlocked,
  title,
  children,
}: CollectionSlotProps) {
  const className = isUnlocked
    ? `${styles.slot} ${styles.unlocked}`
    : `${styles.slot} ${styles.locked}`

  return (
    <div className={className} title={title}>
      {children}
    </div>
  )
}
