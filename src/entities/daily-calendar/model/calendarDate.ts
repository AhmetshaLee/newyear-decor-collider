type CalendarLocalDate = {
  year: number
  month: number
  day: number
}

function getCalendarLocalDate(date: Date): CalendarLocalDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  }
}

function compareCalendarLocalDates(
  left: CalendarLocalDate,
  right: CalendarLocalDate,
): number {
  if (left.year !== right.year) return left.year - right.year
  if (left.month !== right.month) return left.month - right.month

  return left.day - right.day
}

export function isCalendarTimeLockExpired(
  lastClaimedTimestamp: number | null,
  currentDate: Date,
): boolean {
  if (lastClaimedTimestamp === null) return true

  const lastClaimedDate = getCalendarLocalDate(
    new Date(lastClaimedTimestamp),
  )
  const currentLocalDate = getCalendarLocalDate(currentDate)

  return compareCalendarLocalDates(currentLocalDate, lastClaimedDate) > 0
}

export function hasCalendarMonthChanged(
  lastClaimedTimestamp: number | null,
  currentDate: Date,
): boolean {
  if (lastClaimedTimestamp === null) return false

  const lastClaimedDate = getCalendarLocalDate(
    new Date(lastClaimedTimestamp),
  )
  const currentLocalDate = getCalendarLocalDate(currentDate)

  return (
    lastClaimedDate.year !== currentLocalDate.year ||
    lastClaimedDate.month !== currentLocalDate.month
  )
}
