import type { ComponentPropsWithoutRef } from 'react'

import styles from './ShardIcon.module.scss'

export type ShardIconProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
>

export function ShardIcon({ className, ...props }: ShardIconProps) {
  const iconClassName =
    className === undefined ? styles.icon : `${styles.icon} ${className}`

  return <span className={iconClassName} {...props} />
}
