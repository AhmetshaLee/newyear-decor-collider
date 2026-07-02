import { RouterProvider } from 'react-router'
import { router } from './providers/router'
import { PlayerProgressProvider } from '@/entities/player-progress'

import styles from './App.module.scss'
import './styles'

export function App() {
  return (
    <PlayerProgressProvider>
      <div className={styles.appRoot}>
        <RouterProvider router={router} />
      </div>
    </PlayerProgressProvider>
  )
}
