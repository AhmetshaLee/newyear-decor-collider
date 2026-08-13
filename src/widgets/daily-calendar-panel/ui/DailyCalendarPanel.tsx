import { useEffect, useState } from 'react'
import {
  createCalendarMonth,
  getCalendarDayState,
  isCalendarTimeLockExpired,
  type CalendarMonth,
} from '@/entities/daily-calendar'
import { usePlayerProgress } from '@/entities/player-progress'
import {
  claimDailyCalendarReward,
  createCalendarRewardPlan,
  syncDailyCalendarMonth,
  type CalendarRewardSlot,
} from '@/features/claim-daily-calendar'
import {
  CalendarDayCellView,
  CombinedCalendarDayCell,
  type CalendarCell,
  type CalendarVisualCell,
} from './CalendarCell'
import { DailyCalendarClaimNote } from './DailyCalendarClaimNote'
import { DailyCalendarMonthNote } from './DailyCalendarMonthNote'
import { DailyCalendarRewardDialog } from './DailyCalendarRewardDialog'
import styles from './DailyCalendarPanel.module.scss'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const

function createCalendarCells(
  calendarMonth: CalendarMonth,
  currentDayIndex: number,
  todayDay: number,
  isCurrentDayAvailable: boolean,
  rewardPlan: readonly CalendarRewardSlot[],
): readonly CalendarCell[] {
  return calendarMonth.cells.map((day) => {
    if (day === null) return { kind: 'adjacent' }

    return {
      kind: 'day',
      day,
      isToday: day === todayDay,
      state: getCalendarDayState(day, currentDayIndex, isCurrentDayAvailable),
      reward: rewardPlan.find((item) => item.day === day),
    }
  })
}

function createVisualCalendarRows(
  calendarRows: readonly (readonly CalendarCell[])[],
  weekdayCount: number,
): readonly (readonly CalendarVisualCell[])[] {
  if (calendarRows.length === 4) {
    const adjacentRow = Array.from({ length: weekdayCount }, () => ({
      kind: 'adjacent' as const,
    }))

    return [...calendarRows, adjacentRow]
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

export function DailyCalendarPanel() {
  const { progress, commitProgress } = usePlayerProgress()
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null)
  const today = new Date()
  const calendarMonth = createCalendarMonth(today)
  const daysInMonth = calendarMonth.cells.reduce<number>(
    (lastDay, day) => (day === null ? lastDay : day),
    0,
  )
  const rewardPlan = createCalendarRewardPlan(today.getMonth(), daysInMonth)
  const normalizedProgress = syncDailyCalendarMonth(progress, today).progress
  const isCurrentDayAvailable = isCalendarTimeLockExpired(
    normalizedProgress.calendar.lastClaimedTimestamp,
    today,
  )
  const hasClaimedToday =
    normalizedProgress.calendar.lastClaimedTimestamp !== null &&
    !isCurrentDayAvailable
  const calendarCells = createCalendarCells(
    calendarMonth,
    normalizedProgress.calendar.currentDayIndex,
    today.getDate(),
    isCurrentDayAvailable,
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

  const handleClaim = () => {
    const currentDate = new Date()

    const amount = commitProgress((currentProgress) =>
      claimDailyCalendarReward({
        progress: currentProgress,
        currentDate,
        rewardPlan,
      }),
    )

    if (amount !== null) {
      setClaimedAmount(amount)
    }
  }

  const closeRewardDialog = () => {
    setClaimedAmount(null)
  }

  const shouldShowClaimNote =
    claimedAmount === null && hasClaimedToday

  useEffect(() => {
    const currentDate = new Date()

    commitProgress((progress) => syncDailyCalendarMonth(progress, currentDate))
  }, [commitProgress])

  return (
    <section className={styles.panel}>
      <DailyCalendarMonthNote label={calendarMonth.label} />

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
                  if (cell.kind === 'combined') {
                    return (
                      <CombinedCalendarDayCell
                        cells={cell.cells}
                        onClaim={handleClaim}
                        key={`combined-${rowIndex}-${columnIndex}`}
                      />
                    )
                  }

                  return (
                    <CalendarDayCellView
                      cell={cell}
                      onClaim={handleClaim}
                      key={columnIndex}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {shouldShowClaimNote && <DailyCalendarClaimNote />}

      {claimedAmount !== null && (
        <DailyCalendarRewardDialog
          amount={claimedAmount}
          onClose={closeRewardDialog}
        />
      )}
    </section>
  )
}
