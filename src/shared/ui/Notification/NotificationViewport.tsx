import { createPortal } from 'react-dom'
import { NotificationToast } from './NotificationToast'
import type { NotificationItem } from './notificationTypes'

import styles from './NotificationViewport.module.scss'

type NotificationViewportProps = {
  notifications: readonly NotificationItem[]
  onDismiss: (id: string) => void
}

export function NotificationViewport({
  notifications,
  onDismiss,
}: NotificationViewportProps) {
  if (notifications.length === 0) return null

  return createPortal(
    <section className={styles.viewport}>
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </section>,
    document.body,
  )
}
