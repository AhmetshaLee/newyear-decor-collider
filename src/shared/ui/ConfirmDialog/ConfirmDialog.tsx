import type { ReactNode } from 'react'
import { BaseDialog } from '../BaseDialog'

import styles from './ConfirmDialog.module.scss'

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  children: ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  isConfirmDisabled?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function ConfirmDialog({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  isConfirmDisabled = false,
  closeOnOverlayClick = false,
  closeOnEscape = true,
}: ConfirmDialogProps) {
  return (
    <BaseDialog
      ariaLabel={title}
      closeOnEscape={closeOnEscape}
      closeOnOverlayClick={closeOnOverlayClick}
      contentClassName={styles.content}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <section className={styles.panel}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.body}>{children}</div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={styles.confirmButton}
            disabled={isConfirmDisabled}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </BaseDialog>
  )
}
