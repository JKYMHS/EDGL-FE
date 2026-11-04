import type { EditItem } from './types'
import { moveToDay, parseRange, reorder, retime, stayLabel, withStay } from './edit-plan'

const item = (id: string, time: string): EditItem => ({ id, name: id, time, point: { x: 0, y: 0 } })

describe('일정 편집 계산 (FUNC-004-02)', () => {
  it('시간 범위를 분으로 읽는다', () => {
    expect(parseRange('10:00 – 11:30')).toEqual({ start: 600, end: 690 })
    expect(stayLabel(item('a', '10:00 – 11:30'))).toBe('1시간 30분')
  })

  it('체류 시간을 바꾸면 끝나는 시각만 바뀐다', () => {
    expect(withStay(item('a', '10:00 – 11:30'), 120).time).toBe('10:00 – 12:00')
  })

  it('다시 계산하면 첫 시작부터 체류 + 15분 간격으로 시각을 매긴다', () => {
    const items = [item('b', '13:00 – 14:00'), item('a', '10:00 – 11:30')]
    expect(retime(items).map((i) => i.time)).toEqual(['13:00 – 14:00', '14:15 – 15:45'])
  })

  it('순서를 바꾼다', () => {
    expect(reorder(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
    expect(reorder(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })

  it('다른 일차로 옮기면 그 일차 맨 끝에 붙는다', () => {
    const days = {
      1: [item('a', '10:00 – 11:00'), item('b', '11:15 – 12:15')],
      2: [item('c', '10:00 – 11:30')],
    }
    const next = moveToDay(days, 'a', 2)
    expect(next[1].map((i) => i.id)).toEqual(['b'])
    expect(next[2].map((i) => [i.id, i.time])).toEqual([
      ['c', '10:00 – 11:30'],
      ['a', '11:45 – 12:45'],
    ])
  })
})
