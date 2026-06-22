import type { ReactNode } from 'react'

import styles from './DecorationTypeButtonGroup.module.scss'

type DecorationTypeButtonGroupProps = {
  children: ReactNode
}

export function DecorationTypeButtonGroup({
  children,
}: DecorationTypeButtonGroupProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.buttons}>{children}</div>
    </div>
  )
}
