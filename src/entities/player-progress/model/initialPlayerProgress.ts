import type { PlayerProgress } from './types'

export const INITIAL_PLAYER_PROGRESS: PlayerProgress = {
  userShards: 0,
  inventory: [],
  calendar: {
    currentDayIndex: 1,
    lastClaimedTimestamp: null,
  },
  unlockedCollectionIds: [],
}
