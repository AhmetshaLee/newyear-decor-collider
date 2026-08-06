import { RouterProvider } from 'react-router'
import { router } from './providers/router'
import { PlayerProgressProvider } from '@/entities/player-progress'
import { ThemeProvider } from '@/shared/model/theme'
import { NotificationProvider } from '@/shared/ui/Notification'

import styles from './App.module.scss'
import './styles'

export function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <PlayerProgressProvider>
          <div className={styles.appRoot}>
            <RouterProvider router={router} />
          </div>
        </PlayerProgressProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}
