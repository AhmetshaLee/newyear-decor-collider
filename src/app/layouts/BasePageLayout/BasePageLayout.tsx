import { Outlet } from 'react-router'
import { RouteNavigationToolbar } from '@/shared/ui/RouteNavigationToolbar'

import styles from './BasePageLayout.module.scss'

export function BasePageLayout() {
  return (
    <main className={styles.layout}>
      <Outlet />
      <RouteNavigationToolbar className={styles.navigation} />
    </main>
  )
}
