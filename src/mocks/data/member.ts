import type { TravelStyle } from '@/features/onboarding/model/types'

/** 디자인 02·02-2·03·13 예시 */
export const demoUser = {
  name: '김민지',
  email: 'minji@example.com',
  googleEmail: 'minji@gmail.com',
}

export const travelStyles: TravelStyle[] = [
  { id: 'rest', name: '휴식', description: '카페·스파처럼 여유롭게' },
  { id: 'activity', name: '액티비티', description: '체험·레저 위주' },
  { id: 'culture', name: '문화·역사', description: '고궁·박물관·전시' },
  { id: 'food', name: '미식', description: '맛집·시장·로컬 음식' },
  { id: 'nature', name: '자연', description: '산책로·공원·전망' },
  { id: 'shopping', name: '쇼핑', description: '거리·시장·편집숍' },
  { id: 'festival', name: '축제·공연', description: '지역 축제·공연·행사' },
]
export const defaultStyleIds = ['culture', 'food', 'nature']

export type TermItem = { id: string; required: boolean; name: string; description?: string }

/** 약관 필수 3개 + 선택 3개 (PRD 5.1, 6.3) */
export const terms: TermItem[] = [
  { id: 'age', required: true, name: '만 14세 이상이에요' },
  { id: 'service', required: true, name: '서비스 이용약관' },
  {
    id: 'privacy',
    required: true,
    name: '개인정보 수집·이용',
    description: '이메일, 여행 조건, 찜·일정 기록',
  },
  {
    id: 'location',
    required: false,
    name: '위치 정보 이용',
    description: '현재 위치를 출발지로 쓸 때',
  },
  {
    id: 'behavior',
    required: false,
    name: '맞춤 추천을 위한 행동 데이터 수집·이용',
    description: '찜·조회·여행 기록으로 추천을 맞춰요',
  },
  {
    id: 'email',
    required: false,
    name: '이메일 알림 수신',
    description: '다녀온 여행의 방문 확인 메일',
  },
]

/** 이메일 인증 화면 예시 상태 (디자인 02) */
export const emailVerifyDemo = { digits: ['4', '8', '2'], remaining: '04:32', resendIn: 52 }

/** 이미 가입된 이메일 예시 (EMAIL_ALREADY_EXISTS, 디자인 A-1) */
export const takenEmails = ['minji@example.com']

/** 회원가입 1단계 예시 입력 (A-1): 이메일 중복, 비밀번호에 숫자가 빠짐 */
export const signupDemo = { email: 'minji@example.com', password: 'tripseoulgo' }

/** 비밀번호 찾기 예시 (A-2) */
export const passwordResetDemo = {
  email: 'minji@example.com',
  code: '419073',
  remaining: '04:19',
  resendIn: 41,
  attemptsLeft: 3,
}

/** 마이페이지 계정 (C-1) */
export const accountDemo = {
  name: '김민지',
  email: 'minji@example.com',
  google: { linked: true, email: 'minji@gmail.com' },
  /** 구글로만 가입한 계정이면 비밀번호 대신 "비밀번호 설정" */
  googleOnly: false,
  consents: { location: true, behavior: true, emailAlert: false },
}

/** 회원 탈퇴 안내 (C-5) */
export const withdrawSummary = [
  { label: '여행·일정안', value: '5개 여행 · 9개 일정안', mono: true },
  { label: '찜', value: '9곳', mono: true },
  { label: '취향·행동 데이터', value: '모두 삭제' },
  { label: '구글 캘린더에 올린 일정', value: '12개 삭제', mono: true },
]
