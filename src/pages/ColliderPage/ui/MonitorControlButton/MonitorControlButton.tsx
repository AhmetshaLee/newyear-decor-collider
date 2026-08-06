import { type ReactNode } from 'react'

import styles from './MonitorControlButton.module.scss'

type MonitorControlButtonProps = {
  ariaLabel: string
  children: ReactNode
  onClick: () => void
}

export function MonitorControlButton({
  ariaLabel,
  children,
  onClick,
}: MonitorControlButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={styles.button}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
