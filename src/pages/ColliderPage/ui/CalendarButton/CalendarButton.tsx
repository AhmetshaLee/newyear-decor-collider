import styles from './CalendarButton.module.scss'

const CALENDAR_CELLS = Array.from({ length: 21 }, (_, index) => index)

type CalendarButtonProps = {
  className?: string
  onClick: () => void
}

export function CalendarButton({
  className,
  onClick,
}: CalendarButtonProps) {
  const buttonClassName =
    className === undefined
      ? styles.calendar
      : `${styles.calendar} ${className}`

  return (
    <button
      className={buttonClassName}
      type="button"
      onClick={onClick}
    >
      <span className={styles.header}>Календарь</span>

      <span className={styles.sheet}>
        {CALENDAR_CELLS.map((cell) => (
          <span className={styles.day} key={cell} />
        ))}
      </span>
    </button>
  )
}
