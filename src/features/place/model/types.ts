import type { FestivalStatus, IoType } from '@/shared/ui'
import type { MapPoint } from '@/shared/map'

export type PlaceDetail = {
  id: string
  name: string
  status: FestivalStatus
  dday: string
  popularity: number
  /** "1.2k" */
  likeCount: string
  io: IoType
  summary: string
  breadcrumb: [string, string]
  info: { label: string; value: string; mono?: boolean }[]
  extraImageCount: number
}

/** 함께 가기 좋은 곳 (FUNC-002-09) */
export type NearbyPlace = {
  id: string
  name: string
  category: string
  /** "도보 2분" */
  distance: string
  thumb: string
  point: MapPoint
}
