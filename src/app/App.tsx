import { RouterProvider } from 'react-router'

import { router } from './providers/router'

import styles from './App.module.scss'
import './styles'

export function App() {
  return (
    <div className={styles.appRoot}>
      <RouterProvider router={router} />
    </div>
  )
}
