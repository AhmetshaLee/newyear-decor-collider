export type CalendarDayState = 'claimed' | 'active' | 'locked'

export function getCalendarDayState(
  day: number,
  currentDayIndex: number,
): CalendarDayState {
  if (day < currentDayIndex) return 'claimed'
  if (day === currentDayIndex) return 'active'

  return 'locked'
}
