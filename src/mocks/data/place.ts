import type { NearbyPlace, PlaceDetail } from '@/features/place/model/types'

/** 디자인 05 상세 예시 */
export const placeDetail: PlaceDetail = {
  id: 'f-bitchorong',
  name: '서울빛초롱축제',
  status: '예정',
  dday: 'D-13',
  popularity: 990,
  likeCount: '1.2k',
  io: '실외',
  summary: '청계천을 따라 전통 등과 대형 조형 등불이 이어지는 서울의 대표 겨울 야간 축제.',
  breadcrumb: ['축제 목록', '서울 중구'],
  info: [
    { label: '기간', value: '2026.11.01 – 11.17', mono: true },
    { label: '운영 시간', value: '17:00 – 23:00', mono: true },
    { label: '장소', value: '서울 중구 청계천로 일대 (청계광장 ~ 수표교)' },
    { label: '요금', value: '무료' },
  ],
  extraImageCount: 6,
}

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'n-cheonggye',
    name: '청계천',
    category: '하천 · 산책',
    distance: '도보 2분',
    thumb: '#E3E8EC',
    point: { x: 56, y: 50 },
  },
  {
    id: 'n-deoksu',
    name: '덕수궁',
    category: '고궁',
    distance: '도보 9분',
    thumb: '#D6DEE4',
    point: { x: 34, y: 46 },
  },
  {
    id: 'n-gwangjang',
    name: '광장시장',
    category: '시장 · 먹거리',
    distance: '도보 15분',
    thumb: '#E8ECEF',
    point: { x: 68, y: 58 },
  },
  {
    id: 'n-sema',
    name: '서울시립미술관',
    category: '미술관',
    distance: '도보 12분',
    thumb: '#DCE3E8',
    point: { x: 38, y: 62 },
  },
]

export const nearbyDefaultChecked = ['n-cheonggye']
