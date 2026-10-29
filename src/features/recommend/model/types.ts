export type RegionOption = { id: string; name: string; festivals: number; attractions: string }

export type CalendarDay = {
  /** 날짜 숫자 */
  day: number
  /** "2026-10-24" 형식 키 */
  key: string
  /** 이번 달이 아닌 날 */
  outside?: boolean
  today?: boolean
}

export type DepartureOption = { id: string; name: string; address: string }

export type CompanionOption = { id: string; name: string; description: string }

export type MustVisitPlace = {
  id: string
  name: string
  meta: string
  period: string
  /** 여행 기간과 맞지 않을 때 안내 */
  warning?: string
}

/** 추천 요청 5단계에서 고른 값 (TRD 8장 useRecommendDraftStore 자리) */
export type RecommendDraft = {
  regionId: string
  districts: string[]
  start?: string
  end?: string
  startTime: string
  departureId: string
  companionId: string
  indoor: boolean
  mustVisitIds: string[]
}
