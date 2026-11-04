import { toHours } from './time'

describe('toHours', () => {
  it('시·분을 시 단위로 바꾼다', () => {
    expect(toHours('09:00')).toBe(9)
    expect(toHours('11:45')).toBe(11.75)
    expect(toHours('15:20')).toBeCloseTo(15.333, 3)
  })
})
