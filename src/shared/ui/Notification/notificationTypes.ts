export type NotificationType = 'success' | 'error' | 'warning' | 'info'
export type NotificationPhase = 'visible' | 'leaving'

export type NotificationOptions = {
  message: string
  type?: NotificationType
  duration?: number
}

export type NotificationItem = {
  id: string
  message: string
  type: NotificationType
  duration: number
  phase: NotificationPhase
}

export type NotificationContextValue = {
  notify: (options: NotificationOptions) => string
  dismiss: (id: string) => void
}
