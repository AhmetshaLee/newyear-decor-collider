import { Outlet } from 'react-router'

import styles from './BasePageLayout.module.scss'

export function BasePageLayout() {
  return (
    <main className={styles.layout}>
      <Outlet />
    </main>
  )
}
