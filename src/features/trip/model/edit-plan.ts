import { durationLabel, fromMinutes, toMinutes } from '@/shared/lib/time'
import type { EditItem } from './types'

export type EditDays = Record<number, EditItem[]>

/** 장소 사이 이동을 임시로 잡는 간격(분). 실제 이동 시간은 경로 계산 API가 준다 */
export const TEMP_GAP_MINUTES = 15

/** 일정안당 장소 수 1~30개 (PRD 8.1) */
export const MAX_PLACES = 30

/** "10:00 – 11:30" → { start: 600, end: 690 } (분) */
export function parseRange(time: string) {
  const [start, end] = time.split('–').map((t) => toMinutes(t.trim()))
  return { start, end }
}

export function formatRange(start: number, end: number) {
  return `${fromMinutes(start)} – ${fromMinutes(end)}`
}

export function stayMinutes(item: EditItem) {
  const { start, end } = parseRange(item.time)
  return end - start
}

export function stayLabel(item: EditItem) {
  return durationLabel(stayMinutes(item))
}

/** 체류 시간을 바꾼다. 시작 시각은 그대로 */
export function withStay(item: EditItem, minutes: number): EditItem {
  const { start } = parseRange(item.time)
  return { ...item, time: formatRange(start, start + minutes) }
}

/**
 * 첫 장소 시작 시각부터 체류 시간 + 임시 간격으로 시각을 다시 매긴다.
 * "경로 다시 계산"의 목업 결과 (실제로는 서버가 이동 시간을 계산한다).
 */
export function retime(items: EditItem[], firstStart?: number): EditItem[] {
  if (items.length === 0) return items
  let cursor = firstStart ?? parseRange(items[0].time).start
  return items.map((item) => {
    const stay = stayMinutes(item)
    const next = { ...item, time: formatRange(cursor, cursor + stay) }
    cursor += stay + TEMP_GAP_MINUTES
    return next
  })
}

/** 장소를 다른 일차 맨 끝으로 옮긴다 */
export function moveToDay(days: EditDays, id: string, toDay: number): EditDays {
  const fromDay = Number(Object.keys(days).find((d) => days[Number(d)].some((i) => i.id === id)))
  if (!fromDay || fromDay === toDay) return days
  const item = days[fromDay].find((i) => i.id === id)!
  return {
    ...days,
    [fromDay]: days[fromDay].filter((i) => i.id !== id),
    [toDay]: [...days[toDay], placeAt(item, nextStart(days[toDay]))],
  }
}

/** 일차 맨 끝에 붙일 때 시작 시각 (비었으면 10:00) */
export function nextStart(items: EditItem[]) {
  return items.length === 0 ? 600 : parseRange(items.at(-1)!.time).end + TEMP_GAP_MINUTES
}

/** 체류 시간은 그대로 두고 시작 시각만 옮긴다 */
export function placeAt(item: EditItem, start: number): EditItem {
  return { ...item, time: formatRange(start, start + stayMinutes(item)) }
}

/** 같은 일차 안에서 순서를 바꾼다 */
export function reorder<T>(list: T[], from: number, to: number): T[] {
  const next = [...list]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}
