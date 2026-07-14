import {
  useEffect,
  useRef,
  type AnimationEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'

import styles from './BaseDrawer.module.scss'

export type BaseDrawerSide = 'bottom' | 'right'

export type BaseDrawerProps = {
  isOpen: boolean
  side: BaseDrawerSide
  onClose: () => void
  children: ReactNode
  contentClassName?: string
}

export function BaseDrawer({
  isOpen,
  side,
  onClose,
  children,
  contentClassName,
}: BaseDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const drawerClassName = [
    styles.drawer,
    styles[side],
    !isOpen ? styles.closing : '',
  ]
    .filter(Boolean)
    .join(' ')

  const contentClassNameValue =
    contentClassName === undefined
      ? styles.content
      : `${styles.content} ${contentClassName}`

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()

    if (isOpen) onClose()
  }

  const handleContentAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return

    if (isOpen) return

    const dialogElement = dialogRef.current

    if (dialogElement?.open) {
      dialogElement.close()
    }
  }

  useEffect(() => {
    const dialogElement = dialogRef.current

    if (dialogElement === null) return

    if (!isOpen || dialogElement.open) return

    dialogElement.showModal()
  }, [isOpen])

  return (
    <dialog className={drawerClassName} onCancel={handleCancel} ref={dialogRef}>
      <div
        className={contentClassNameValue}
        onAnimationEnd={handleContentAnimationEnd}
      >
        {children}
      </div>
    </dialog>
  )
}
