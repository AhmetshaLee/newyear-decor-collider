import styles from './DailyCalendarClaimNote.module.scss'

export function DailyCalendarClaimNote() {
  return (
    <div className={styles.note}>
      <span className={styles.tape} />
      <p>
        Награда получена
        <br />
        Отметка поставлена
        <br />
        Приходите завтра
      </p>
    </div>
  )
}
