import { isCalendarTimeLockExpired } from '@/entities/daily-calendar'
import type {
  PlayerProgress,
  PlayerProgressTransactionResult,
} from '@/entities/player-progress'
import type { CalendarRewardSlot } from './calendarRewardPlan'
import { syncDailyCalendarMonth } from './syncDailyCalendarMonth'

export type ClaimDailyCalendarRewardInput = {
  progress: PlayerProgress
  currentDate: Date
  rewardPlan: readonly CalendarRewardSlot[]
}

export function claimDailyCalendarReward({
  progress,
  currentDate,
  rewardPlan,
}: ClaimDailyCalendarRewardInput): PlayerProgressTransactionResult<
  number | null
> {
  const normalizedProgress = syncDailyCalendarMonth(
    progress,
    currentDate,
  ).progress

  if (
    !isCalendarTimeLockExpired(
      normalizedProgress.calendar.lastClaimedTimestamp,
      currentDate,
    )
  ) {
    return {
      progress: normalizedProgress,
      result: null,
    }
  }

  const reward = rewardPlan.find(
    (slot) => slot.day === normalizedProgress.calendar.currentDayIndex,
  )

  if (reward === undefined) {
    return {
      progress: normalizedProgress,
      result: null,
    }
  }

  return {
    progress: {
      ...normalizedProgress,
      userShards: normalizedProgress.userShards + reward.amount,
      calendar: {
        ...normalizedProgress.calendar,
        currentDayIndex: normalizedProgress.calendar.currentDayIndex + 1,
        lastClaimedTimestamp: currentDate.getTime(),
      },
    },
    result: reward.amount,
  }
}
