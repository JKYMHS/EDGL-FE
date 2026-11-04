import { addDays, firstOfMonth, lastOfMonth, weekdayMonFirst } from '@/shared/lib/date'
import type { CalendarDay } from './types'

/** 앞으로 몇 달까지 고를 수 있는지 */
export const MAX_MONTHS_AHEAD = 12

/**
 * 달력 주(월요일 시작). 오늘이 있는 달은 지난주부터 보여 준다 (디자인 07-2: 10.19 기준 10.12 주부터).
 * 다른 달은 1일이 있는 주부터 말일이 있는 주까지.
 */
export function buildWeeks(year: number, month: number, today: string): CalendarDay[][] {
  const first = firstOfMonth(year, month)
  const last = lastOfMonth(year, month)
  const thisMonth = today.slice(0, 7) === first.slice(0, 7)
  const anchor = thisMonth ? addDays(today, -7) : first
  let cursor = addDays(anchor, -weekdayMonFirst(anchor))
  if (cursor < addDays(first, -weekdayMonFirst(first)))
    cursor = addDays(first, -weekdayMonFirst(first))

  const weeks: CalendarDay[][] = []
  while (cursor <= last) {
    const week: CalendarDay[] = []
    for (let i = 0; i < 7; i += 1) {
      const key = addDays(cursor, i)
      week.push({
        day: Number(key.slice(8)),
        key,
        outside: key.slice(0, 7) !== first.slice(0, 7) || undefined,
        today: key === today || undefined,
      })
    }
    weeks.push(week)
    cursor = addDays(cursor, 7)
  }
  return weeks
}
