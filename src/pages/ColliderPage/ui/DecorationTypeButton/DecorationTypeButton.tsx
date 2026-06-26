import type { ReactNode } from 'react'

import styles from './DecorationTypeButton.module.scss'

type DecorationTypeButtonProps = {
  children: ReactNode
  isSelected: boolean
  onClick: () => void
}

export function DecorationTypeButton({
  children,
  isSelected,
  onClick,
}: DecorationTypeButtonProps) {
  return (
    <span className={styles.buttonFrame}>
      <button
        className={`${styles.button} ${isSelected ? styles.selected : ''}`}
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
    </span>
  )
}
