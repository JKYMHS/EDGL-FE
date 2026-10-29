import type {
  CalendarItem,
  Course,
  EditItem,
  TripPlan,
  TripSummary,
} from '@/features/trip/model/types'

/** 디자인 08·09·10·11·12의 "고궁과 정동 야행" 예시 */
export const demoCourse: Course = {
  title: '고궁과 정동 야행 1박 2일',
  conditions: '서울 · 1박 2일 · 친구',
  summary: { places: 9, moveTime: '1:12' },
  days: [
    { day: 1, date: '10.24', weekday: '토' },
    { day: 2, date: '10.25', weekday: '일' },
  ],
  timeline: {
    1: [
      {
        kind: 'place',
        id: 'c1',
        n: 1,
        time: '10:00',
        name: '경복궁',
        meta: '고궁 · 1시간 30분',
        reason: '개장 직후라 덜 붐비고 10시 수문장 교대식을 볼 수 있어요',
        point: { x: 24, y: 38 },
      },
      { kind: 'move', mode: 'walk', label: '도보 14분' },
      {
        kind: 'place',
        id: 'c2',
        n: 2,
        time: '11:45',
        name: '국립현대미술관 서울',
        meta: '미술관 · 1시간',
        point: { x: 30, y: 50 },
      },
      { kind: 'meal', time: '12:45', label: '점심 시간 · 60분', link: '주변 음식점 8곳 보기' },
      { kind: 'move', mode: 'walk', label: '도보 10분' },
      {
        kind: 'place',
        id: 'c3',
        n: 3,
        time: '14:00',
        name: '북촌 한옥마을',
        meta: '마을 산책 · 1시간',
        point: { x: 44, y: 30 },
      },
      { kind: 'move', mode: 'transit', label: '버스 18분' },
      {
        kind: 'place',
        id: 'c4',
        n: 4,
        time: '15:20',
        name: '덕수궁',
        meta: '고궁 · 1시간',
        reason: '정동야행 동선과 이어져 이동이 짧아요',
        point: { x: 58, y: 60 },
      },
      { kind: 'meal', time: '16:30', label: '저녁 시간 · 60분', link: '정동길 음식점 5곳 보기' },
      { kind: 'move', mode: 'walk', label: '도보 6분' },
      {
        kind: 'place',
        id: 'c5',
        n: 5,
        time: '18:00',
        name: '정동야행',
        meta: '축제 · 2시간',
        tag: '꼭 포함',
        point: { x: 64, y: 70 },
      },
    ],
    2: [
      {
        kind: 'place',
        id: 'd1',
        n: 1,
        time: '10:00',
        name: '창덕궁',
        meta: '고궁 · 1시간 30분',
        point: { x: 70, y: 40 },
      },
      { kind: 'move', mode: 'transit', label: '버스 12분' },
      {
        kind: 'place',
        id: 'd2',
        n: 2,
        time: '12:00',
        name: '익선동 한옥거리',
        meta: '거리 · 1시간',
        point: { x: 80, y: 30 },
      },
      { kind: 'move', mode: 'taxi', label: '택시 15분' },
      {
        kind: 'place',
        id: 'd3',
        n: 3,
        time: '14:00',
        name: '국립중앙박물관',
        meta: '박물관 · 1시간 30분',
        point: { x: 86, y: 48 },
      },
    ],
  },
  points: {
    1: [
      { x: 24, y: 38 },
      { x: 30, y: 50 },
      { x: 44, y: 30 },
      { x: 58, y: 60 },
      { x: 64, y: 70 },
    ],
    2: [
      { x: 70, y: 40 },
      { x: 80, y: 30 },
      { x: 86, y: 48 },
    ],
  },
}

/** 지도에서 선택한 장소 카드 (디자인 09) */
export const demoCourseFocus = {
  day: 1,
  n: 3,
  time: '14:00 – 15:00',
  name: '북촌 한옥마을',
  next: '버스 18분 → 덕수궁',
}

/** AI 코스 생성 단계 (디자인 08) */
export const generatingSteps = [
  { label: '후보 장소 고르기', result: '143 → 26곳' },
  { label: '일차별 코스 짜기', result: '9곳 · 2일' },
  { label: '운영 시간 확인하기', detail: '덕수궁 입장 마감 17:30 반영 중' },
  { label: '이동 경로·수단 계산하기' },
  { label: '식사 시간 비워두기' },
]

/** 생성 중 지도의 후보 점 (디자인 08) */
export const candidateDots = Array.from({ length: 26 }, (_, i) => ({
  x: 12 + ((i * 37) % 76),
  y: 14 + ((i * 53) % 72),
}))

export const retryQuota = { used: 6, total: 10 }

export const trips: TripSummary[] = [
  {
    id: 't-palace',
    title: '고궁과 정동 야행',
    subtitle: '서울 · 친구 · 확정: 기본 코스',
    period: '10.24 – 10.25',
    planCount: 3,
    sync: 'synced',
    dday: 'D-5',
    group: 'upcoming',
    thumb: '#E3E8EC',
  },
  {
    id: 't-cheonggye',
    title: '빛초롱 보러 가는 청계천',
    subtitle: '서울 · 연인 · 확정: 청계천 야경',
    period: '11.08',
    planCount: 1,
    sync: 'changed',
    dday: 'D-20',
    group: 'upcoming',
    thumb: '#D6DEE4',
  },
  {
    id: 't-busan',
    title: '부산 해운대 2박 3일',
    subtitle: '부산 · 가족 · 아직 확정 전',
    unconfirmed: true,
    period: '12.19 – 12.21',
    planCount: 2,
    sync: 'none',
    dday: 'D-61',
    group: 'upcoming',
    thumb: '#E8ECEF',
  },
  {
    id: 't-haneul',
    title: '가을 억새 하늘공원',
    subtitle: '서울 · 혼자 · 방문 3/4',
    period: '10.11',
    planCount: 1,
    sync: 'synced',
    dday: '완료',
    group: 'past',
    thumb: '#E3E8EC',
  },
  {
    id: 't-jeonju',
    title: '전주 한옥마을 당일',
    subtitle: '전북 · 부모님 · 방문 6/6',
    period: '09.27',
    planCount: 1,
    sync: 'none',
    dday: '완료',
    group: 'past',
    thumb: '#D6DEE4',
  },
]

export const tripDetail = {
  id: 't-palace',
  title: '고궁과 정동 야행',
  meta: '서울 중구·종로구',
  period: '10.24 – 10.25',
  extra: '친구 · 서울역 출발',
  dday: 'D-5',
}

export const tripPlans: TripPlan[] = [
  {
    id: 'p-basic',
    name: '기본 코스',
    status: '확정',
    places: 9,
    moveTime: '1:12',
    origin: '10.18 AI 추천',
  },
  {
    id: 'p-rain',
    name: '비 오는 날 코스',
    status: '초안',
    places: 7,
    moveTime: '0:58',
    origin: '10.19 AI 다시 추천',
  },
  {
    id: 'p-jeongdong',
    name: '정동 중심 여유 코스',
    status: '초안',
    places: 6,
    moveTime: '0:40',
    origin: '10.19 직접 만듦',
  },
]

/** 내 여행 목록에서 선택한 여행의 일정안 카드 (디자인 11-1) */
export const tripListFocus = {
  tripId: 't-palace',
  meta: '서울',
  period: '10.24 – 10.25',
  companion: '친구',
}

/** 일정 편집 예시 (디자인 10) */
export const editItems: Record<number, EditItem[]> = {
  1: [
    { id: 'e1', name: '경복궁', time: '10:00 – 11:30', point: { x: 26, y: 40 } },
    { id: 'e2', name: '북촌 한옥마을', time: '11:45 – 12:45', point: { x: 44, y: 30 } },
    {
      id: 'e3',
      name: '국립현대미술관 서울',
      time: '13:00 – 14:00',
      warning: '점심 시간대와 겹쳐요',
      point: { x: 32, y: 52 },
    },
    {
      id: 'e4',
      name: '덕수궁',
      time: '17:40 – 18:40',
      warning: '17:30 입장 마감 이후 방문이에요',
      point: { x: 58, y: 62 },
    },
    { id: 'e5', name: '정동야행', time: '19:00 – 21:00', point: { x: 64, y: 72 } },
  ],
  2: [
    { id: 'e6', name: '창덕궁', time: '10:00 – 11:30', point: { x: 70, y: 40 } },
    { id: 'e7', name: '익선동 한옥거리', time: '12:00 – 13:00', point: { x: 80, y: 30 } },
    { id: 'e8', name: '국립중앙박물관', time: '14:00 – 15:30', point: { x: 86, y: 48 } },
    { id: 'e9', name: '용산가족공원', time: '15:45 – 16:30', point: { x: 74, y: 60 } },
  ],
}
export const editDemo = { draggingId: 'e2', unsavedChanges: 3, period: '10.24 – 10.25' }

/** 캘린더 업로드 예시 (디자인 12) */
export const calendarItems: CalendarItem[] = [
  {
    id: 'k1',
    day: 1,
    start: '10:00',
    end: '11:30',
    duration: '1시간 30분',
    name: '경복궁',
    state: 'new',
  },
  {
    id: 'k2',
    day: 1,
    start: '11:45',
    end: '12:45',
    duration: '1시간',
    name: '국립현대미술관 서울',
    shortName: '국립현대미술관',
    state: 'new',
  },
  {
    id: 'k3',
    day: 1,
    start: '14:00',
    end: '15:00',
    duration: '1시간',
    name: '북촌 한옥마을',
    state: 'changed',
  },
  {
    id: 'k4',
    day: 1,
    start: '15:20',
    end: '16:20',
    duration: '1시간',
    name: '덕수궁',
    state: 'synced',
  },
  {
    id: 'k5',
    day: 1,
    start: '18:00',
    end: '20:00',
    duration: '2시간',
    name: '정동야행',
    state: 'new',
  },
  {
    id: 'k6',
    day: 2,
    start: '10:00',
    end: '11:30',
    duration: '1시간 30분',
    name: '창덕궁',
    state: 'new',
  },
  {
    id: 'k7',
    day: 2,
    start: '12:00',
    end: '13:00',
    duration: '1시간',
    name: '익선동 한옥거리',
    shortName: '익선동',
    state: 'changed',
  },
  {
    id: 'k8',
    day: 2,
    start: '14:00',
    end: '15:30',
    duration: '1시간 30분',
    name: '국립중앙박물관',
    state: 'new',
  },
]
/** 점심 시간 자리 (장소 미선택이라 업로드에서 빠짐) */
export const calendarMealSlot = {
  day: 1,
  before: 'k3',
  start: '12:45',
  label: '점심 시간 60분 · 장소 미선택이라 제외',
}
export const calendarAccount = { email: 'minji@gmail.com', calendarName: '여행' }
