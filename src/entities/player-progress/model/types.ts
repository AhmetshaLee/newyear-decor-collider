export type InventoryItem = {
  id: string
  decorationId: string
  timestamp: number
  recycleValue: number
}

export type CalendarProgress = {
  currentDayIndex: number
  lastClaimedTimestamp: number | null
}

export type PlayerProgress = {
  userShards: number
  inventory: InventoryItem[]
  calendar: CalendarProgress
  unlockedCollectionIds: string[]
}
