import styles from './DailyCalendarMonthNote.module.scss'

type DailyCalendarMonthNoteProps = {
  label: string
}

export function DailyCalendarMonthNote({
  label,
}: DailyCalendarMonthNoteProps) {
  return (
    <div className={styles.note}>
      <span className={styles.clip} />
      <p>{label}</p>
    </div>
  )
}
