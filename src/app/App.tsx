import { RouterProvider } from 'react-router'
import { router } from './providers/router'
import { PlayerProgressProvider } from '@/entities/player-progress'
import { NotificationProvider } from '@/shared/ui/Notification'

import styles from './App.module.scss'
import './styles'

export function App() {
  return (
    <NotificationProvider>
      <PlayerProgressProvider>
        <div className={styles.appRoot}>
          <RouterProvider router={router} />
        </div>
      </PlayerProgressProvider>
    </NotificationProvider>
  )
}
