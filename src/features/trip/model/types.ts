import type { MapPoint, RouteMode } from '@/shared/map'
import type { SyncState } from '@/shared/ui'

export type CourseDay = { day: number; date: string; weekday: string }

export type CourseStop = {
  kind: 'place'
  id: string
  n: number
  time: string
  name: string
  meta: string
  reason?: string
  tag?: string
  point: MapPoint
}
export type CourseMove = {
  kind: 'move'
  mode: Exclude<RouteMode, 'temp' | 'progress'>
  label: string
}
export type CourseMeal = { kind: 'meal'; time: string; label: string; link: string }
export type CourseItem = CourseStop | CourseMove | CourseMeal

export type Course = {
  title: string
  conditions: string
  summary: { places: number; moveTime: string }
  days: CourseDay[]
  /** 일차별 타임라인 */
  timeline: Record<number, CourseItem[]>
  /** 일차별 지도 좌표 (번호 순) */
  points: Record<number, MapPoint[]>
}

export type TripGroup = 'upcoming' | 'past'

export type TripSummary = {
  id: string
  title: string
  subtitle: string
  /** 아직 확정 전이면 부제를 경고 색으로 */
  unconfirmed?: boolean
  period: string
  planCount: number
  sync: SyncState
  dday: string
  group: TripGroup
  thumb: string
}

export type PlanStatus = '확정' | '초안'

export type TripPlan = {
  id: string
  name: string
  status: PlanStatus
  places: number
  moveTime: string
  origin: string
}

export type EditItem = {
  id: string
  name: string
  time: string
  warning?: string
  point: MapPoint
}

export type CalendarItem = {
  id: string
  day: number
  start: string
  end: string
  duration: string
  name: string
  state: 'new' | 'changed' | 'synced'
  /** 캘린더 미리보기에 쓰는 짧은 이름 */
  shortName?: string
}
