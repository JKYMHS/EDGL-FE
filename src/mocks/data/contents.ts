import type { AttractionItem, FestivalItem } from '@/features/explore/model/types'

/** 디자인 04·06의 예시 데이터. API 연결 전까지 화면을 채운다. */
const THUMBS = ['#DCE3E8', '#E3E8EC', '#D6DEE4', '#E8ECEF']

type FestivalSeed = [
  string,
  string,
  string,
  FestivalItem['status'],
  string,
  number,
  number,
  number,
  FestivalItem['io'],
]

function festival(id: string, i: number, seed: FestivalSeed, liked = false): FestivalItem {
  const [name, gu, period, status, dday, popularity, x, y, io] = seed
  return {
    kind: 'festival',
    id,
    name,
    region: `서울 ${gu}`,
    period,
    status,
    dday,
    popularity,
    io,
    thumb: THUMBS[i % 4],
    point: { x, y },
    liked,
  }
}

const F: Record<string, FestivalSeed> = {
  억새: ['서울억새축제', '마포구', '10.11 – 10.24', '진행중', '~D-5', 920, 20, 46, '실외'],
  한성백제: [
    '한성백제문화제',
    '송파구',
    '10.17 – 10.19',
    '진행중',
    '오늘까지',
    760,
    84,
    66,
    '실외',
  ],
  정동야행: ['정동야행', '중구', '10.23 – 10.25', '예정', 'D-4', 880, 46, 52, '실내·실외'],
  이태원: ['이태원지구촌축제', '용산구', '10.24 – 10.25', '예정', 'D-5', 840, 44, 70, '실외'],
  드럼: ['서울드럼페스티벌', '중구', '10.25 – 10.26', '예정', 'D-6', 410, 60, 46, '실외'],
  빛초롱: ['서울빛초롱축제', '중구', '11.01 – 11.17', '예정', 'D-13', 990, 54, 40, '실외'],
  김장: ['서울김장문화제', '중구', '11.07 – 11.09', '예정', 'D-19', 300, 64, 56, '실외'],
  크리스마스: ['서울 크리스마스마켓', '중구', '12.12 – 12.25', '예정', 'D-54', 650, 50, 34, '실외'],
  한복: ['종로 한복축제', '종로구', '10.10 – 10.12', '종료', '종료', 520, 48, 24, '실외'],
}

export const exploreFestivals: FestivalItem[] = [
  festival('f-eoksae', 0, F.억새, true),
  festival('f-hanseong', 1, F.한성백제),
  festival('f-jeongdong', 2, F.정동야행, true),
  festival('f-itaewon', 3, F.이태원),
  festival('f-drum', 4, F.드럼),
  festival('f-bitchorong', 5, F.빛초롱, true),
  festival('f-kimjang', 6, F.김장),
  festival('f-christmas', 7, F.크리스마스),
  festival('f-hanbok', 8, F.한복),
]

/** 디자인 04에서 처음 선택된 행, 비교에 담긴 행 */
export const exploreFestivalDefaults = {
  selectedId: 'f-bitchorong',
  hoverId: 'f-jeongdong',
  compareIds: ['f-bitchorong', 'f-jeongdong'],
}

export const likedFestivals: FestivalItem[] = [
  { ...festival('f-bitchorong', 0, F.빛초롱, true), point: { x: 56, y: 42 } },
  { ...festival('f-jeongdong', 1, F.정동야행, true), point: { x: 48, y: 54 } },
  { ...festival('f-itaewon', 2, F.이태원, true), point: { x: 45, y: 72 } },
  festival('f-eoksae', 3, F.억새, true),
  { ...festival('f-hanbok', 4, F.한복, true), point: { x: 50, y: 26 } },
]

export const likedFestivalDefaults = {
  selectedId: 'f-bitchorong',
  compareIds: ['f-bitchorong', 'f-jeongdong', 'f-itaewon'],
  summary: {
    title: '비교 중인 3곳',
    parts: [
      { text: '정동야행·이태원지구촌축제', strong: true },
      { text: '는 10.24 – 25 주말에 겹쳐요. 빛초롱은 11월이라 따로 묶는 게 좋아요.' },
    ],
  },
}

type AttractionSeed = [
  string,
  string,
  string,
  AttractionItem['openStatus'],
  string,
  number,
  number,
  AttractionItem['io'],
]

function attraction(id: string, i: number, seed: AttractionSeed, liked = false): AttractionItem {
  const [name, gu, category, openStatus, hours, x, y, io] = seed
  return {
    kind: 'attraction',
    id,
    name,
    region: `서울 ${gu}`,
    category,
    openStatus,
    hours,
    io,
    thumb: THUMBS[i % 4],
    point: { x, y },
    liked,
  }
}

const A: Record<string, AttractionSeed> = {
  경복궁: ['경복궁', '종로구', '고궁', 'open', '~18:00', 42, 52, '실내·실외'],
  북촌: ['북촌 한옥마을', '종로구', '마을', 'open', '~17:00', 52, 26, '실외'],
  중앙박물관: ['국립중앙박물관', '용산구', '박물관', 'open', '~18:00', 44, 72, '실내'],
  남산타워: ['남산서울타워', '용산구', '전망', 'open', '~23:00', 50, 56, '실내·실외'],
  롯데타워: ['롯데월드타워 서울스카이', '송파구', '전망', 'open', '~22:00', 86, 64, '실내'],
  하늘공원: ['하늘공원', '마포구', '공원', 'soon', '~17:30', 16, 48, '실외'],
  창덕궁: ['창덕궁', '종로구', '고궁', 'closed', '월요일 휴무', 56, 32, '실내·실외'],
  덕수궁: ['덕수궁', '중구', '고궁', 'closed', '월요일 휴무', 58, 62, '실내·실외'],
}

export const exploreAttractions: AttractionItem[] = [
  attraction('a-gyeongbok', 0, A.경복궁, true),
  attraction('a-bukchon', 1, A.북촌),
  attraction('a-museum', 2, A.중앙박물관, true),
  attraction('a-namsan', 3, A.남산타워, true),
  attraction('a-lotte', 4, A.롯데타워),
  attraction('a-haneul', 5, A.하늘공원),
  attraction('a-changdeok', 6, A.창덕궁),
  attraction('a-deoksu', 7, A.덕수궁, true),
]

export const exploreAttractionDefaults = {
  selectedId: 'a-gyeongbok',
  hoverId: 'a-museum',
  compareIds: ['a-gyeongbok', 'a-museum'],
  /** 선택한 관광지 지도 카드의 보조 문구 */
  selectedNote: '서울 종로구 · 고궁 · 화요일 휴무',
}

export const likedAttractions: AttractionItem[] = [
  attraction('a-gyeongbok', 0, A.경복궁, true),
  attraction('a-museum', 1, A.중앙박물관, true),
  attraction('a-namsan', 2, A.남산타워, true),
  attraction('a-deoksu', 3, A.덕수궁, true),
]

export const likedAttractionDefaults = {
  selectedId: 'a-gyeongbok',
  compareIds: ['a-gyeongbok', 'a-museum'],
  summary: {
    title: '비교 중인 2곳',
    parts: [
      { text: '경복궁', strong: true },
      { text: '은 화요일, ' },
      { text: '국립중앙박물관', strong: true },
      { text: '은 연중무휴예요. 주말 방문은 둘 다 괜찮아요.' },
    ],
  },
}

export const exploreMeta = {
  festivalCount: 9,
  attractionCount: 8,
  regionLabel: '서울',
  today: '10.19 월',
}
