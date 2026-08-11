import { useEffect } from 'react'
import {
  createCalendarMonth,
  getCalendarDayState,
  type CalendarDayState,
  type CalendarMonth,
} from '@/entities/daily-calendar'
import { usePlayerProgress } from '@/entities/player-progress'
import { syncDailyCalendarMonth } from '@/features/sync-daily-calendar-month'
import styles from './DailyCalendarPanel.module.scss'
import {
  DAILY_CALENDAR_DISPLAY_CONFIG,
  type CalendarDayRewardDisplay,
} from './dailyCalendarDisplayConfig'

type CalendarDayCell = {
  kind: 'day'
  day: number
  isToday: boolean
  state: CalendarDayState
  reward?: CalendarDayRewardDisplay
}

type CalendarCell = CalendarDayCell | { kind: 'adjacent' }

type CalendarVisualCell =
  | CalendarCell
  | { kind: 'empty' }
  | { kind: 'combined'; cells: readonly [CalendarDayCell, CalendarDayCell] }

function createCalendarCells(
  calendarMonth: CalendarMonth,
  currentDayIndex: number,
  todayDay: number,
): readonly CalendarCell[] {
  return calendarMonth.cells.map((day) => {
    if (day === null) return { kind: 'adjacent' }

    return {
      kind: 'day',
      day,
      isToday: day === todayDay,
      state: getCalendarDayState(day, currentDayIndex),
      reward: DAILY_CALENDAR_DISPLAY_CONFIG.rewards.find(
        (item) => item.day === day,
      )?.reward,
    }
  })
}

function createVisualCalendarRows(
  calendarRows: readonly (readonly CalendarCell[])[],
  weekdayCount: number,
): readonly (readonly CalendarVisualCell[])[] {
  if (calendarRows.length === 4) {
    const emptyRow = Array.from({ length: weekdayCount }, () => ({
      kind: 'empty' as const,
    }))

    return [...calendarRows, emptyRow]
  }

  if (calendarRows.length !== 6) {
    return calendarRows
  }

  const previousRow = calendarRows[calendarRows.length - 2]
  const lastRow = calendarRows[calendarRows.length - 1]

  if (previousRow === undefined || lastRow === undefined) {
    return calendarRows
  }

  const combinedRow = previousRow.map((cell, columnIndex) => {
    const secondaryCell = lastRow[columnIndex]

    if (cell.kind !== 'day' || secondaryCell?.kind !== 'day') {
      return cell
    }

    return {
      kind: 'combined' as const,
      cells: [cell, secondaryCell] as const,
    }
  })

  return [...calendarRows.slice(0, -2), combinedRow]
}

function RewardVisual({
  day,
  reward,
}: {
  day: number
  reward: CalendarDayRewardDisplay
}) {
  const { visual, presentation } = reward

  return (
    <span
      className={styles.rewardVisual}
      data-sticker-color={
        presentation === 'sticker' ? reward.stickerColor : undefined
      }
      data-visual={visual}
      data-presentation={presentation}
    >
      <span className={styles.rewardIcon} />
      {presentation === 'sticker' && (
        <span className={styles.rewardBadge}>{day}</span>
      )}
    </span>
  )
}

function CalendarCellContent({ cell }: { cell: CalendarDayCell }) {
  const shouldShowDayNumber = cell.reward?.presentation !== 'sticker'

  return (
    <>
      {shouldShowDayNumber && (
        <span className={styles.dayNumber}>{cell.day}</span>
      )}
      {cell.reward !== undefined && (
        <RewardVisual day={cell.day} reward={cell.reward} />
      )}
    </>
  )
}

function CalendarDayCell({ cell }: { cell: CalendarCell }) {
  if (cell.kind === 'adjacent') {
    return <td className={`${styles.dayCell} ${styles.otherMonthCell}`} />
  }

  return (
    <td
      className={styles.dayCell}
      data-state={cell.state}
      data-today={cell.isToday ? '' : undefined}
    >
      <CalendarCellContent cell={cell} />
    </td>
  )
}

function CombinedCalendarDayCell({
  cells,
}: {
  cells: readonly [CalendarDayCell, CalendarDayCell]
}) {
  return (
    <td className={`${styles.dayCell} ${styles.combinedCell}`}>
      <div className={styles.combinedCellBody}>
        {cells.map((cell, cellIndex) => {
          return (
            <div
              className={styles.combinedCellPart}
              data-part={cellIndex === 0 ? 'upper' : 'lower'}
              data-state={cell.state}
              data-today={cell.isToday ? '' : undefined}
              key={cell.day}
            >
              <CalendarCellContent cell={cell} />
            </div>
          )
        })}
      </div>
    </td>
  )
}

export function DailyCalendarPanel() {
  const { progress, commitProgress } = usePlayerProgress()
  const today = new Date()
  const calendarMonth = createCalendarMonth(today)
  const calendarCells = createCalendarCells(
    calendarMonth,
    progress.calendar.currentDayIndex,
    today.getDate(),
  )
  const weekdayCount = DAILY_CALENDAR_DISPLAY_CONFIG.weekdays.length
  const calendarRowCount = calendarCells.length / weekdayCount
  const calendarRows = Array.from(
    {
      length: calendarRowCount,
    },
    (_, rowIndex) => {
      const rowStart = rowIndex * weekdayCount

      return calendarCells.slice(rowStart, rowStart + weekdayCount)
    },
  )
  const visualCalendarRows = createVisualCalendarRows(
    calendarRows,
    weekdayCount,
  )

  useEffect(() => {
    const currentDate = new Date()

    commitProgress((progress) => syncDailyCalendarMonth(progress, currentDate))
  }, [commitProgress])

  return (
    <section className={styles.panel}>
      <div className={styles.monthNoteGroup}>
        <div className={styles.monthNote}>{calendarMonth.label}</div>
        <span className={styles.paperClip} />
      </div>

      <div className={styles.paper}>
        <div className={styles.binding}>
          {Array.from({ length: 9 }, (_, index) => (
            <span className={styles.bindingSegment} key={index} />
          ))}
        </div>

        <table className={styles.calendarGrid}>
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
            {visualCalendarRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => {
                  if (cell.kind === 'empty') {
                    return (
                      <td
                        className={`${styles.dayCell} ${styles.otherMonthCell}`}
                        key={`empty-${rowIndex}-${columnIndex}`}
                      />
                    )
                  }

                  if (cell.kind === 'combined') {
                    return (
                      <CombinedCalendarDayCell
                        cells={cell.cells}
                        key={`combined-${rowIndex}-${columnIndex}`}
                      />
                    )
                  }

                  return <CalendarDayCell cell={cell} key={columnIndex} />
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
