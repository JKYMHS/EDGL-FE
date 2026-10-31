/** 온보딩 2~5단계 선택지 (PRD FUNC-001-13) */
export type Pace = 'relaxed' | 'packed'
export type TimeOfDay = 'early' | 'morning' | 'afternoon'

export const PACE_OPTIONS: {
  value: Pace
  name: string
  range: string
  description: string
  bars: number
}[] = [
  {
    value: 'relaxed',
    name: '여유롭게',
    range: '2~3',
    description: '한 곳에 오래 머물러요',
    bars: 3,
  },
  { value: 'packed', name: '알차게', range: '4~5', description: '여러 곳을 둘러봐요', bars: 5 },
]

export const TIME_OPTIONS: { value: TimeOfDay; name: string; time: string; description: string }[] =
  [
    { value: 'early', name: '이른 아침', time: '09:00', description: '사람 적을 때 먼저 둘러봐요' },
    { value: 'morning', name: '오전', time: '10:00', description: '여유 있게 출발해요' },
    { value: 'afternoon', name: '점심 이후', time: '13:00', description: '늦게 시작해 저녁까지' },
  ]

export type OnboardingAnswers = {
  styleIds: string[]
  pace: Pace
  timeOfDay: TimeOfDay
  accessible: boolean
  pet: boolean
}
