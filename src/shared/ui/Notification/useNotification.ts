import { useContext } from 'react'
import { NotificationContext } from './NotificationContext'

export function useNotification() {
  const context = useContext(NotificationContext)

  if (context === null) {
    throw new Error(
      'useNotification должен использоваться внутри NotificationProvider',
    )
  }

  return context
}
