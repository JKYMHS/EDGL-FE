import { buildWeeks } from './calendar'

describe('추천 요청 달력 (07-2) · FUNC-003-01', () => {
  it('오늘이 있는 달은 지난주부터 말일이 있는 주까지 (디자인과 같은 3주)', () => {
    const weeks = buildWeeks(2026, 10, '2026-10-19')
    expect(weeks.map((w) => w[0].key)).toEqual(['2026-10-12', '2026-10-19', '2026-10-26'])
    expect(weeks[2].at(-1)).toMatchObject({ key: '2026-11-01', outside: true })
    expect(weeks[1][0].today).toBe(true)
  })

  it('다른 달은 1일이 있는 주부터 모두 보여 준다', () => {
    const weeks = buildWeeks(2026, 11, '2026-10-19')
    expect(weeks[0][0].key).toBe('2026-10-26')
    expect(weeks[0][6]).toMatchObject({ key: '2026-11-01', day: 1 })
    expect(weeks.at(-1)!.at(-1)!.key).toBe('2026-12-06')
  })
})
