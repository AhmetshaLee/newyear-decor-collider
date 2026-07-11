export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export type NotificationOptions = {
  message: string
  type?: NotificationType
}

export type NotificationItem = {
  id: string
  message: string
  type: NotificationType
}

export type NotificationContextValue = {
  notify: (options: NotificationOptions) => string
  dismiss: (id: string) => void
}
