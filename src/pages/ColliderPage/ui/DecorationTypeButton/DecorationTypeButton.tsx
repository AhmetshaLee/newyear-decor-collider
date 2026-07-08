import type { ReactNode } from 'react'

import styles from './DecorationTypeButton.module.scss'

type DecorationTypeButtonProps = {
  children: ReactNode
  isDisabled?: boolean
  isSelected: boolean
  onClick: () => void
}

export function DecorationTypeButton({
  children,
  isDisabled = false,
  isSelected,
  onClick,
}: DecorationTypeButtonProps) {
  const buttonClassName = [
    styles.button,
    isSelected ? styles.selected : '',
    isDisabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={styles.buttonFrame}>
      <button
        className={buttonClassName}
        disabled={isDisabled}
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
    </span>
  )
}
