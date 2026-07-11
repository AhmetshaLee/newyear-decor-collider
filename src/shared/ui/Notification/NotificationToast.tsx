import {
  useEffect,
  useState,
  type AnimationEvent,
  type FocusEvent,
} from 'react'
import type { NotificationItem, NotificationType } from './notificationTypes'

import styles from './NotificationToast.module.scss'

type NotificationToastProps = {
  notification: NotificationItem
  onDismiss: (id: string) => void
  onExited: (id: string) => void
}

const TYPE_META: Record<
  NotificationType,
  { label: string; symbol: string; className: string }
> = {
  success: { label: 'Успешно', symbol: '✓', className: styles.success },
  error: { label: 'Ошибка', symbol: '!', className: styles.error },
  warning: { label: 'Предупреждение', symbol: '!', className: styles.warning },
  info: { label: 'Информация', symbol: 'i', className: styles.info },
}

export function NotificationToast({
  notification,
  onDismiss,
  onExited,
}: NotificationToastProps) {
  const [isPointerInside, setIsPointerInside] = useState(false)
  const [isFocusInside, setIsFocusInside] = useState(false)

  const isPaused = isPointerInside || isFocusInside

  const meta = TYPE_META[notification.type]
  const className = `${styles.toast} ${meta.className}${
    notification.phase === 'leaving' ? ` ${styles.leaving}` : ''
  }`

  const handleAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return
    if (notification.phase !== 'leaving') return

    onExited(notification.id)
  }

  const handleFocus = () => {
    setIsFocusInside(true)
  }

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return

    setIsFocusInside(false)
  }

  useEffect(() => {
    if (notification.phase === 'leaving' || isPaused) return

    const timeoutId = window.setTimeout(() => {
      onDismiss(notification.id)
    }, notification.duration)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    isPaused,
    notification.duration,
    notification.id,
    notification.phase,
    onDismiss,
  ])

  return (
    <article
      className={className}
      onAnimationEnd={handleAnimationEnd}
      onMouseEnter={() => setIsPointerInside(true)}
      onMouseLeave={() => setIsPointerInside(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span className={styles.symbol}>{meta.symbol}</span>
      <div>
        <strong className={styles.title}>{meta.label}</strong>
        <p className={styles.message}>{notification.message}</p>
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => onDismiss(notification.id)}
      >
        <span>×</span>
      </button>
    </article>
  )
}
