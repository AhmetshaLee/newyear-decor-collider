export type CalendarDayState = 'claimed' | 'active' | 'locked'

export function getCalendarDayState(
  day: number,
  currentDayIndex: number,
  isCurrentDayAvailable = true,
): CalendarDayState {
  if (day < currentDayIndex) return 'claimed'
  if (day === currentDayIndex && isCurrentDayAvailable) return 'active'

  return 'locked'
}
