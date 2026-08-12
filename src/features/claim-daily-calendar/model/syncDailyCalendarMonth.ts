import { hasCalendarMonthChanged } from '@/entities/daily-calendar'
import type {
  PlayerProgress,
  PlayerProgressTransactionResult,
} from '@/entities/player-progress'

export function syncDailyCalendarMonth(
  progress: PlayerProgress,
  currentDate: Date,
): PlayerProgressTransactionResult<void> {
  if (
    !hasCalendarMonthChanged(
      progress.calendar.lastClaimedTimestamp,
      currentDate,
    )
  ) {
    return {
      progress,
      result: undefined,
    }
  }

  return {
    progress: {
      ...progress,
      calendar: {
        currentDayIndex: 1,
        lastClaimedTimestamp: null,
      },
    },
    result: undefined,
  }
}
