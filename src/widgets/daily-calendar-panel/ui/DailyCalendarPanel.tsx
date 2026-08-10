import styles from './DailyCalendarPanel.module.scss'
import {
  DAILY_CALENDAR_DISPLAY_CONFIG,
  type CalendarDayDisplay,
  type CalendarDayRewardDisplay,
} from './dailyCalendarDisplayConfig'

type CalendarCell =
  | { kind: 'currentMonth'; day: CalendarDayDisplay }
  | { kind: 'otherMonth'; day: number }

const CALENDAR_CELLS: readonly CalendarCell[] = [
  ...DAILY_CALENDAR_DISPLAY_CONFIG.previousMonthDays.map((day) => ({
    day,
    kind: 'otherMonth' as const,
  })),
  ...DAILY_CALENDAR_DISPLAY_CONFIG.days.map((day) => ({
    day,
    kind: 'currentMonth' as const,
  })),
  ...DAILY_CALENDAR_DISPLAY_CONFIG.nextMonthDays.map((day) => ({
    day,
    kind: 'otherMonth' as const,
  })),
]

const CALENDAR_ROWS = Array.from(
  {
    length: Math.ceil(
      CALENDAR_CELLS.length / DAILY_CALENDAR_DISPLAY_CONFIG.weekdays.length,
    ),
  },
  (_, rowIndex) => {
    const rowStart = rowIndex * DAILY_CALENDAR_DISPLAY_CONFIG.weekdays.length

    return CALENDAR_CELLS.slice(
      rowStart,
      rowStart + DAILY_CALENDAR_DISPLAY_CONFIG.weekdays.length,
    )
  },
)

type RewardVisualProps = CalendarDayRewardDisplay

function RewardVisual({
  visual,
  presentation,
  badge,
  sticker,
}: RewardVisualProps) {
  return (
    <span
      className={styles.rewardVisual}
      data-sticker={sticker}
      data-visual={visual}
      data-presentation={presentation}
    >
      <span className={styles.rewardIcon} />
      {badge !== undefined && (
        <span className={styles.rewardBadge}>{badge}</span>
      )}
    </span>
  )
}

export function DailyCalendarPanel() {
  return (
    <section className={styles.panel}>
      <div className={styles.monthNote}>
        {DAILY_CALENDAR_DISPLAY_CONFIG.month}
      </div>
      <span className={styles.paperClip} />

      <div className={styles.paper}>
        <div className={styles.binding}>
          {Array.from({ length: 9 }, (_, index) => (
            <span className={styles.bindingSegment} key={index} />
          ))}
        </div>

        <h2 className={styles.visuallyHidden} id="daily-calendar-title">
          Календарь наград за {DAILY_CALENDAR_DISPLAY_CONFIG.month}
        </h2>

        <table className={styles.calendarGrid}>
          <caption className={styles.visuallyHidden}>
            Демонстрационная сетка наград за{' '}
            {DAILY_CALENDAR_DISPLAY_CONFIG.month}
          </caption>
          <thead>
            <tr>
              {DAILY_CALENDAR_DISPLAY_CONFIG.weekdays.map((weekday) => (
                <th key={weekday} scope="col">
                  {weekday}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CALENDAR_ROWS.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell) => {
                  if (cell.kind === 'otherMonth') {
                    return (
                      <td
                        className={`${styles.dayCell} ${styles.otherMonthCell}`}
                        key={`other-${rowIndex}-${cell.day}`}
                      >
                        <span className={styles.dayNumber}>{cell.day}</span>
                      </td>
                    )
                  }

                  const day = cell.day
                  const isActiveDay =
                    day.day === DAILY_CALENDAR_DISPLAY_CONFIG.activeDay

                  return (
                    <td
                      className={styles.dayCell}
                      data-active={isActiveDay ? '' : undefined}
                      key={day.day}
                    >
                      {day.reward === null ? (
                        <span className={styles.dayNumber}>{day.day}</span>
                      ) : (
                        <>
                          {!(
                            day.reward.visual === 'toy' &&
                            day.reward.presentation === 'featured'
                          ) && (
                            <span className={styles.dayNumber}>{day.day}</span>
                          )}
                          <RewardVisual {...day.reward} />
                        </>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
