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
