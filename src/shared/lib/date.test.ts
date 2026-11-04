import { daysBetween, formatMonthDay, formatShortRange, tripLengthLabel } from './date'

describe('date', () => {
  it('두 날짜 사이 일수를 센다 (달이 바뀌어도)', () => {
    expect(daysBetween('2026-10-24', '2026-10-25')).toBe(1)
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2)
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1)
  })

  it('여행 길이를 "N박 N+1일"로 쓴다', () => {
    expect(tripLengthLabel('2026-10-24', '2026-10-25')).toBe('1박 2일')
    expect(tripLengthLabel('2026-10-24', '2026-10-27')).toBe('3박 4일')
    expect(tripLengthLabel('2026-10-24', '2026-10-24')).toBe('당일')
  })

  it('짧은 기간 표시는 같은 달이면 월을 한 번만 쓴다', () => {
    expect(formatMonthDay('2026-11-01')).toBe('11.01')
    expect(formatShortRange('2026-10-24', '2026-10-25')).toBe('10.24 – 25')
    expect(formatShortRange('2026-10-31', '2026-11-01')).toBe('10.31 – 11.01')
    expect(formatShortRange('2026-10-24', '2026-10-24')).toBe('10.24')
  })
})

describe('달력 계산', () => {
  it('날짜를 더하고 요일(월=0)을 구한다', async () => {
    const { addDays, weekdayMonFirst, lastOfMonth, shiftMonth } = await import('./date')
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
    expect(weekdayMonFirst('2026-10-19')).toBe(0)
    expect(weekdayMonFirst('2026-10-25')).toBe(6)
    expect(lastOfMonth(2026, 2)).toBe('2026-02-28')
    expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 })
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 })
  })
})
