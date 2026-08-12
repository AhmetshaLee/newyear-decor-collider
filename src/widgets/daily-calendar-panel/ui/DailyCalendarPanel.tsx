import { useEffect } from 'react'
import {
  createCalendarMonth,
  getCalendarDayState,
  type CalendarDayState,
  type CalendarMonth,
} from '@/entities/daily-calendar'
import { usePlayerProgress } from '@/entities/player-progress'
import {
  createCalendarRewardPlan,
  syncDailyCalendarMonth,
  type CalendarRewardSlot,
} from '@/features/claim-daily-calendar'
import styles from './DailyCalendarPanel.module.scss'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const

type CalendarDayCell = {
  kind: 'day'
  day: number
  isToday: boolean
  state: CalendarDayState
  reward?: CalendarRewardSlot
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
  rewardPlan: readonly CalendarRewardSlot[],
): readonly CalendarCell[] {
  return calendarMonth.cells.map((day) => {
    if (day === null) return { kind: 'adjacent' }

    return {
      kind: 'day',
      day,
      isToday: day === todayDay,
      state: getCalendarDayState(day, currentDayIndex),
      reward: rewardPlan.find((item) => item.day === day),
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
  slot,
}: {
  slot: CalendarRewardSlot
}) {
  const { presentation } = slot

  return (
    <span
      className={styles.rewardVisual}
      data-sticker-color={
        presentation === 'sticker' ? slot.stickerColor : undefined
      }
      data-presentation={presentation}
    >
      <span className={styles.rewardIcon} />
      {presentation === 'sticker' && (
        <span className={styles.rewardBadge}>{slot.day}</span>
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
        <RewardVisual slot={cell.reward} />
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
  const daysInMonth = calendarMonth.cells.reduce<number>(
    (lastDay, day) => (day === null ? lastDay : day),
    0,
  )
  const rewardPlan = createCalendarRewardPlan(
    today.getMonth(),
    daysInMonth,
  )
  const calendarCells = createCalendarCells(
    calendarMonth,
    progress.calendar.currentDayIndex,
    today.getDate(),
    rewardPlan,
  )
  const weekdayCount = WEEKDAYS.length
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
              {WEEKDAYS.map((weekday) => (
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
