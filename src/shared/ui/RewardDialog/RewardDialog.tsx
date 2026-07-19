import type { ReactNode } from 'react'
import { BaseDialog } from '../BaseDialog'

import styles from './RewardDialog.module.scss'

type RewardDialogProps = {
  isOpen: boolean
  title: string
  onClose: () => void
  visualSlot: ReactNode
  children?: ReactNode
  actionsSlot?: ReactNode
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function RewardDialog({
  isOpen,
  title,
  onClose,
  visualSlot,
  children,
  actionsSlot,
  closeOnOverlayClick = false,
  closeOnEscape = true,
}: RewardDialogProps) {
  return (
    <BaseDialog
      closeOnEscape={closeOnEscape}
      closeOnOverlayClick={closeOnOverlayClick}
      contentClassName={styles.content}
      isOpen={isOpen}
      overlayClassName={styles.overlay}
      onClose={onClose}
    >
      <section className={styles.panel}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.ribbon}>
          <div className={styles.visual}>{visualSlot}</div>
        </div>

        {children !== undefined && (
          <div className={styles.body}>{children}</div>
        )}

        {actionsSlot !== undefined && (
          <div className={styles.actions}>{actionsSlot}</div>
        )}
      </section>
    </BaseDialog>
  )
}
