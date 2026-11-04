import { durationLabel, fromMinutes, toHours, toMinutes } from './time'

describe('toHours', () => {
  it('시·분을 시 단위로 바꾼다', () => {
    expect(toHours('09:00')).toBe(9)
    expect(toHours('11:45')).toBe(11.75)
    expect(toHours('15:20')).toBeCloseTo(15.333, 3)
  })
})

describe('toMinutes · fromMinutes', () => {
  it('시·분과 분을 서로 바꾼다', () => {
    expect(toMinutes('10:30')).toBe(630)
    expect(fromMinutes(630)).toBe('10:30')
    expect(fromMinutes(545)).toBe('09:05')
  })
})

describe('durationLabel', () => {
  it('시간·분을 한국어로 쓴다', () => {
    expect(durationLabel(45)).toBe('45분')
    expect(durationLabel(60)).toBe('1시간')
    expect(durationLabel(90)).toBe('1시간 30분')
  })
})

describe('formatClock · parseClock', () => {
  it('남은 초를 분:초로 쓴다', async () => {
    const { formatClock, parseClock } = await import('./time')
    expect(formatClock(272)).toBe('04:32')
    expect(formatClock(-3)).toBe('00:00')
    expect(parseClock('04:19')).toBe(259)
  })
})
