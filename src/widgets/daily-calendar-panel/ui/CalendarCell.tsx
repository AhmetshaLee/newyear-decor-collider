import type { CalendarDayState } from '@/entities/daily-calendar'
import type { CalendarRewardSlot } from '@/features/claim-daily-calendar'
import { ShardIcon } from '@/shared/ui/ShardIcon'
import styles from './DailyCalendarPanel.module.scss'

export type CalendarDayCell = {
  kind: 'day'
  day: number
  isToday: boolean
  state: CalendarDayState
  reward?: CalendarRewardSlot
}

export type CalendarCell = CalendarDayCell | { kind: 'adjacent' }

export type CalendarVisualCell =
  | CalendarCell
  | { kind: 'combined'; cells: readonly [CalendarDayCell, CalendarDayCell] }

function RewardVisual({ slot }: { slot: CalendarRewardSlot }) {
  const { presentation } = slot

  return (
    <span
      className={styles.rewardVisual}
      data-sticker-color={
        presentation === 'sticker' ? slot.stickerColor : undefined
      }
      data-presentation={presentation}
    >
      <ShardIcon className={styles.rewardIcon} />
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
      {cell.reward !== undefined && <RewardVisual slot={cell.reward} />}
    </>
  )
}

function CalendarCellAction({
  cell,
  onClaim,
}: {
  cell: CalendarDayCell
  onClaim: () => void
}) {
  if (cell.state !== 'active') {
    return <CalendarCellContent cell={cell} />
  }

  return (
    <button className={styles.claimButton} type="button" onClick={onClaim}>
      <CalendarCellContent cell={cell} />
    </button>
  )
}

export function CalendarDayCellView({
  cell,
  onClaim,
}: {
  cell: CalendarCell
  onClaim: () => void
}) {
  if (cell.kind === 'adjacent') {
    return <td className={`${styles.dayCell} ${styles.otherMonthCell}`} />
  }

  return (
    <td
      className={styles.dayCell}
      data-state={cell.state}
      data-today={cell.isToday ? '' : undefined}
    >
      <CalendarCellAction cell={cell} onClaim={onClaim} />
    </td>
  )
}

export function CombinedCalendarDayCell({
  cells,
  onClaim,
}: {
  cells: readonly [CalendarDayCell, CalendarDayCell]
  onClaim: () => void
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
              <CalendarCellAction cell={cell} onClaim={onClaim} />
            </div>
          )
        })}
      </div>
    </td>
  )
}
