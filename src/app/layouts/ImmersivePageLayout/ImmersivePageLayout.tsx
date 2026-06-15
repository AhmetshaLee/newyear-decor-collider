import { Outlet } from 'react-router'

import styles from './ImmersivePageLayout.module.scss'

export function ImmersivePageLayout() {
  return (
    <main className={styles.layout}>
      <Outlet />
    </main>
  )
}
