import type { ReactNode } from 'react'

import styles from './ControlLabel.module.scss'

type ControlLabelProps = {
  children: ReactNode
  className?: string
}

export function ControlLabel({ children, className }: ControlLabelProps) {
  const labelClassName = className
    ? `${styles.label} ${className}`
    : styles.label

  return <h2 className={labelClassName}>{children}</h2>
}
