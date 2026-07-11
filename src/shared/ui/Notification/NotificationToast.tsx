import type { NotificationItem, NotificationType } from './notificationTypes'

import styles from './NotificationToast.module.scss'

type NotificationToastProps = {
  notification: NotificationItem
  onDismiss: (id: string) => void
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
}: NotificationToastProps) {
  const meta = TYPE_META[notification.type]
  const className = `${styles.toast} ${meta.className}`

  return (
    <article className={className}>
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
