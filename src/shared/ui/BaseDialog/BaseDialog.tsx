import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'

import styles from './BaseDialog.module.scss'

type BaseDialogProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  overlayClassName?: string
  contentClassName?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function BaseDialog({
  isOpen,
  onClose,
  children,
  overlayClassName,
  contentClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: BaseDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const overlayClassNameValue =
    overlayClassName === undefined
      ? styles.overlay
      : `${styles.overlay} ${overlayClassName}`

  const contentClassNameValue =
    contentClassName === undefined
      ? styles.content
      : `${styles.content} ${contentClassName}`

  useEffect(() => {
    const dialogElement = dialogRef.current

    if (dialogElement === null) return

    if (isOpen && !dialogElement.open) {
      dialogElement.showModal()
      return
    }

    if (!isOpen && dialogElement.open) {
      dialogElement.close()
    }
  }, [isOpen])

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()

    if (closeOnEscape) onClose()
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (!closeOnOverlayClick) return

    if (event.target !== event.currentTarget) return

    onClose()
  }

  return (
    <dialog
      className={overlayClassNameValue}
      onCancel={handleCancel}
      onClick={handleOverlayClick}
      ref={dialogRef}
    >
      <div className={contentClassNameValue}>{children}</div>
    </dialog>
  )
}
