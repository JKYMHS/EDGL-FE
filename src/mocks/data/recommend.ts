import type {
  CompanionOption,
  DepartureOption,
  MustVisitPlace,
  RecommendDraft,
  RegionOption,
} from '@/features/recommend/model/types'

/** 디자인 07-1~07-5 예시 */
export const regionOptions: RegionOption[] = [
  { id: 'seoul', name: '서울', festivals: 9, attractions: '2,410' },
  { id: 'busan', name: '부산', festivals: 6, attractions: '1,120' },
  { id: 'jeju', name: '제주', festivals: 4, attractions: '980' },
  { id: 'gangwon', name: '강원', festivals: 7, attractions: '1,540' },
  { id: 'gyeongbuk', name: '경북', festivals: 5, attractions: '1,310' },
  { id: 'jeonbuk', name: '전북', festivals: 3, attractions: '860' },
]

export const districtOptions = [
  '중구',
  '종로구',
  '용산구',
  '마포구',
  '성동구',
  '송파구',
  '강남구',
  '영등포구',
]
/** "+17"을 누르면 보이는 서울 나머지 구 */
export const moreDistrictOptions = [
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '서대문구',
  '서초구',
  '성북구',
  '양천구',
  '은평구',
  '중랑구',
]

/** 데모 기준 오늘 (디자인 07-2). 이전 날짜는 회색 */
export const calendarPastBefore = '2026-10-19'
export const calendarMonth = { year: 2026, month: 10 }

export const startTimeOptions = ['09:00', '10:00', '11:00', '13:00'] as const

export const departureResults: DepartureOption[] = [
  { id: 'seoul-station', name: '서울역', address: '서울 용산구 한강대로 405 · 기차역' },
  { id: 'seoul-bus', name: '서울역 버스환승센터', address: '서울 중구 · 버스' },
  { id: 'seoul-arex', name: '서울역 공항철도', address: '서울 중구 · 지하철' },
]
/** 현재 위치 좌표 → 주소 목업. 카카오 SDK 역지오코딩으로 바꾼다 (TRD 9장) */
export const resolveDemoAddress = async () => '서울 중구 세종대로 110 근처'

export const recentDepartures = ['김포공항', '용산역', '집']

export const companionOptions: CompanionOption[] = [
  { id: 'alone', name: '혼자', description: '내 페이스대로, 1인 입장 가능한 곳 위주' },
  { id: 'couple', name: '연인', description: '야경·산책로·분위기 좋은 식당' },
  { id: 'friends', name: '친구', description: '체험·축제·먹거리, 이동이 조금 길어도 괜찮아요' },
  { id: 'kids', name: '아이 동반', description: '고르면 아이 나이를 한 번 더 물어봐요' },
  { id: 'parents', name: '부모님', description: '걷는 거리 짧게, 쉬는 시간 넉넉하게' },
]

export const mustVisitCandidates: MustVisitPlace[] = [
  { id: 'f-jeongdong', name: '정동야행', meta: '서울 중구 · 축제', period: '10.23 – 10.25' },
  {
    id: 'f-bitchorong',
    name: '서울빛초롱축제',
    meta: '서울 중구 · 축제',
    period: '11.01 – 11.17',
    warning: '여행 기간에 열리지 않아요 (11.01부터)',
  },
  {
    id: 'f-itaewon',
    name: '이태원지구촌축제',
    meta: '서울 용산구 · 축제',
    period: '10.24 – 10.25',
  },
  { id: 'a-gyeongbok', name: '경복궁', meta: '서울 종로구 · 고궁', period: '상시' },
]
/** 꼭 포함할 장소 "장소 이름으로 추가" 검색 대상 */
export const mustVisitSearchPool: MustVisitPlace[] = [
  { id: 'a-namsan', name: '남산서울타워', meta: '서울 용산구 · 전망', period: '상시' },
  { id: 'a-deoksu', name: '덕수궁', meta: '서울 중구 · 고궁', period: '상시' },
  { id: 'a-museum', name: '국립중앙박물관', meta: '서울 용산구 · 박물관', period: '상시' },
  { id: 's-cheonggye', name: '청계천', meta: '서울 중구 · 산책로', period: '상시' },
]
export const MUST_VISIT_LIMIT = 5

export const recommendQuota = { left: 7, total: 10 }

export const initialDraft: RecommendDraft = {
  regionId: 'seoul',
  districts: ['중구', '종로구'],
  start: '2026-10-24',
  end: '2026-10-25',
  startTime: '10:00',
  departureId: 'seoul-station',
  companionId: 'friends',
  indoor: false,
  mustVisitIds: ['f-jeongdong', 'f-bitchorong'],
}
