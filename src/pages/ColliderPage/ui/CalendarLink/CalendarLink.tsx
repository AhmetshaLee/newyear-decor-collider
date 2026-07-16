import { Link } from 'react-router'

import styles from './CalendarLink.module.scss'

const CALENDAR_CELLS = Array.from({ length: 21 }, (_, index) => index)

type CalendarLinkProps = {
  className?: string
}

export function CalendarLink({ className }: CalendarLinkProps) {
  const linkClassName =
    className === undefined
      ? styles.calendar
      : `${styles.calendar} ${className}`

  return (
    <Link className={linkClassName} to="/calendar">
      <span className={styles.header}>Календарь</span>

      <span className={styles.sheet}>
        {CALENDAR_CELLS.map((cell) => (
          <span className={styles.day} key={cell} />
        ))}
      </span>
    </Link>
  )
}
