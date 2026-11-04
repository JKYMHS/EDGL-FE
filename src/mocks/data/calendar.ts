/** 캘린더 연동·일괄 업로드 예시 (시안 C-2, D-1, D-2) · FUNC-005-01, 02 */
export const calendarLink = {
  email: 'minji@gmail.com',
  linkedSince: '10.20',
  uploadedEvents: 12,
  calendars: ['여행', '김민지', '가족'],
  defaultCalendar: '여행',
  syncedTrips: [
    { title: '고궁과 정동 야행', sync: 'synced' as const },
    { title: '빛초롱 보러 가는 청계천', sync: 'changed' as const },
  ],
}

export type BulkTrip = {
  id: string
  title: string
  planName: string
  events: number
  period: string
  dday: string
  past: boolean
}

export const bulkTrips: BulkTrip[] = [
  {
    id: 't-palace',
    title: '고궁과 정동 야행',
    planName: '기본 코스',
    events: 9,
    period: '10.24 – 10.25',
    dday: 'D-5',
    past: false,
  },
  {
    id: 't-cheonggye',
    title: '빛초롱 보러 가는 청계천',
    planName: '청계천 야경',
    events: 5,
    period: '11.08',
    dday: 'D-20',
    past: false,
  },
  {
    id: 't-haneul',
    title: '가을 억새 하늘공원',
    planName: '지난 여행',
    events: 4,
    period: '10.11',
    dday: '완료',
    past: true,
  },
]
export const unconfirmedTripTitle = '부산 해운대 2박 3일'

/** 일괄 업로드 결과 예시: 청계천 여행에서 1개 실패 (CALENDAR_NOT_WRITABLE) */
export const bulkFailures: Record<string, { time: string; name: string; reason: string }[]> = {
  't-cheonggye': [{ time: '19:00', name: '청계천 야경 산책', reason: '캘린더에 쓸 수 없어요' }],
}
