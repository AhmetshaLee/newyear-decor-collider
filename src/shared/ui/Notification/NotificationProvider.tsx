import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  type NotificationContextValue,
  type NotificationItem,
  type NotificationOptions,
} from './notificationTypes'
import { NotificationContext } from './NotificationContext'
import { NotificationViewport } from './NotificationViewport'

type NotificationProviderProps = {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const nextIdRef = useRef(0)

  const notify = useCallback((options: NotificationOptions) => {
    const id = `notification-${Date.now()}-${nextIdRef.current}`
    nextIdRef.current += 1

    const notification: NotificationItem = {
      id,
      message: options.message,
      type: options.type ?? 'info',
    }

    setNotifications((currentNotifications) => [
      notification,
      ...currentNotifications,
    ])

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => notification.id !== id),
    )
  }, [])

  const value = useMemo<NotificationContextValue>(
    () => ({ notify, dismiss }),
    [notify, dismiss],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationViewport notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  )
}
