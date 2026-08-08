import styles from './DailyCalendarPanel.module.scss'

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, index) => index + 1)

export function DailyCalendarPanel() {
  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h2 className={styles.title}>Календарь</h2>
      </header>

      <ol className={styles.daysGrid}>
        {CALENDAR_DAYS.map((day) => (
          <li className={styles.dayCell} key={day}>
            <span className={styles.dayNumber}>{day}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
