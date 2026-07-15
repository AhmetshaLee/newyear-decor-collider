import { NavLink } from 'react-router'

import styles from './RouteNavigationToolbar.module.scss'

const ROUTE_NAVIGATION_ITEMS = [
  {
    to: '/calendar',
    label: 'Календарь',
    icon: '📅',
  },
  {
    to: '/collider',
    label: 'Коллайдер',
    icon: '⚛️',
  },
] as const

type RouteNavigationToolbarProps = {
  className?: string
}

export function RouteNavigationToolbar({
  className,
}: RouteNavigationToolbarProps) {
  const toolbarClassName =
    className === undefined ? styles.toolbar : `${styles.toolbar} ${className}`

  return (
    <nav className={toolbarClassName} aria-label="Навигация приложения">
      {ROUTE_NAVIGATION_ITEMS.map((item) => (
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.activeLink}` : styles.link
          }
          key={item.to}
          to={item.to}
          title={item.label}
          aria-label={item.label}
        >
          <span aria-hidden="true">{item.icon}</span>
        </NavLink>
      ))}
    </nav>
  )
}
