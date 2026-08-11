const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  month: '2-digit',
  year: 'numeric',
})

export type CalendarMonth = {
  label: string
  cells: readonly (number | null)[]
}

export type CalendarDayState = 'claimed' | 'active' | 'locked'

export function getCalendarDayState(
  day: number,
  currentDayIndex: number,
): CalendarDayState {
  if (day < currentDayIndex) return 'claimed'
  if (day === currentDayIndex) return 'active'

  return 'locked'
}

function getMondayFirstDayIndex(dayOfWeek: number): number {
  return (dayOfWeek + 6) % 7
}

export function createCalendarMonth(snapshot: Date): CalendarMonth {
  const year = snapshot.getFullYear()
  const monthIndex = snapshot.getMonth()
  const monthStart = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingCellCount = getMondayFirstDayIndex(monthStart.getDay())
  const trailingCellCount = (7 - ((leadingCellCount + daysInMonth) % 7)) % 7

  const cells = [
    ...Array.from({ length: leadingCellCount }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ...Array.from({ length: trailingCellCount }, () => null),
  ]

  return {
    label: MONTH_LABEL_FORMATTER.format(monthStart),
    cells,
  }
}
