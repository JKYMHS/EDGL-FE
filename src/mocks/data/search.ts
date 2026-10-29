/** 디자인 03-5·03-6 검색 시작 예시 */
export const searchSuggestionChips = [
  '이번 주말 축제',
  '지금 진행중',
  '밤에 가기 좋은 곳',
  '아이와 함께',
]

export type AutocompleteItem = {
  id: string
  /** 제목. 검색어와 같은 부분은 강조한다 */
  title: string
  /** 제목 옆 작은 글씨 (예: "(경복궁 안)") */
  note?: string
  meta: string
  /** 메타 중 숫자 글꼴로 쓰는 부분 */
  metaMono?: string
  thumb: string
  dday?: string
  icon?: boolean
}

export type AutocompleteGroup = { label: '관광지' | '축제' | '지역'; items: AutocompleteItem[] }

export const autocompleteGroups: AutocompleteGroup[] = [
  {
    label: '관광지',
    items: [
      {
        id: 'a-gyeongbok',
        title: '경복궁',
        meta: '서울 종로구 · 고궁 · 운영 중 ~18:00',
        thumb: '#DCE3E8',
      },
      {
        id: 'a-gogung',
        title: '국립고궁박물관',
        note: '(경복궁 안)',
        meta: '서울 종로구 · 박물관',
        thumb: '#E3E8EC',
      },
    ],
  },
  {
    label: '축제',
    items: [
      {
        id: 'f-byeolbit',
        title: '경복궁 별빛야행',
        meta: '서울 종로구 · ',
        metaMono: '10.29 – 11.09',
        thumb: '#D6DEE4',
        dday: 'D-10',
      },
    ],
  },
  {
    label: '지역',
    items: [
      {
        id: 'r-gyeongbok',
        title: '경복궁 주변',
        meta: '종로구 · 반경 1km 안의 축제와 관광지',
        thumb: '#F3F5F7',
        icon: true,
      },
    ],
  },
]

export const recentSearches = ['정동야행', '북촌']
