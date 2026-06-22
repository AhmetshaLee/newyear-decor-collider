import type { ReactNode } from 'react'

import styles from './ColliderControlLabel.module.scss'

type ColliderControlLabelProps = {
  children: ReactNode
}

export function ColliderControlLabel({ children }: ColliderControlLabelProps) {
  return <h2 className={styles.label}>{children}</h2>
}
