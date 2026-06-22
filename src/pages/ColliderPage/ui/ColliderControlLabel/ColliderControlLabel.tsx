import type { ReactNode } from 'react'

import styles from './ColliderControlLabel.module.scss'

type ColliderControlLabelProps = {
  children: ReactNode
  className?: string
}

export function ColliderControlLabel({
  children,
  className,
}: ColliderControlLabelProps) {
  const labelClassName = className
    ? `${styles.label} ${className}`
    : styles.label

  return <h2 className={labelClassName}>{children}</h2>
}
