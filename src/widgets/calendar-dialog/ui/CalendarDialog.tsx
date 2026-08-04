import { BaseDialog } from '@/shared/ui/BaseDialog'

import styles from './CalendarDialog.module.scss'

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, index) => index + 1)

type CalendarDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function CalendarDialog({ isOpen, onClose }: CalendarDialogProps) {
  return (
    <BaseDialog
      contentClassName={styles.content}
      isOpen={isOpen}
      onClose={onClose}
    >
      <section
        aria-label="Ежедневный календарь наград"
        className={styles.panel}
      >
        <header className={styles.header}>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
          >
            ×
          </button>

          <h2 className={styles.title}>
            <span>Ежедневный календарь наград</span>
          </h2>
        </header>

        <div className={styles.body}>
          <ol className={styles.daysGrid}>
            {CALENDAR_DAYS.map((day) => (
              <li className={styles.dayCell} key={day}>
                <span className={styles.dayNumber}>{day}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </BaseDialog>
  )
}
