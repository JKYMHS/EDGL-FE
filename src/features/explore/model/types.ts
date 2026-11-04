import type { FestivalStatus, IoType, OpenStatus } from '@/shared/ui'
import type { MapPoint } from '@/shared/map'

type ContentBase = {
  id: string
  name: string
  /** "서울 중구" */
  region: string
  io: IoType
  /** 대표 이미지 자리 색 (이미지가 들어오기 전) */
  thumb: string
  point: MapPoint
  liked: boolean
}

export type FestivalItem = ContentBase & {
  kind: 'festival'
  period: string
  status: FestivalStatus
  /** "D-4", "~D-5", "오늘까지", "종료" */
  dday: string
  popularity: number
}

export type AttractionItem = ContentBase & {
  kind: 'attraction'
  category: string
  openStatus: OpenStatus
  /** "~18:00", "월요일 휴무" */
  hours: string
  closedDay?: string
}

export type ContentItem = FestivalItem | AttractionItem
