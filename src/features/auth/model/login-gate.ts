/** 로그인 필요 모달 상황 4종 (PRD 5.0, 디자인 14-2) */
export type LoginGateReason = 'wish' | 'recommend' | 'compare' | 'trip'

export type LoginGateCopy = {
  title: string
  body: string
  /** 보조 버튼 문구 */
  dismiss: string
  /** 로그인 뒤 일어나는 일 */
  after: string
}

export const LOGIN_GATE_COPY: Record<LoginGateReason, LoginGateCopy> = {
  wish: {
    title: '로그인하고 찜해 두세요',
    body: '찜한 곳은 지도에서 모아 비교하고, 코스에 바로 담을 수 있어요.',
    dismiss: '계속 둘러보기',
    after: '로그인하면 이 화면으로 돌아와 찜이 바로 저장돼요',
  },
  recommend: {
    title: 'AI 코스 추천은 로그인 후에 쓸 수 있어요',
    body: '취향과 동행에 맞춘 일차별 코스를 하루 10번까지 받을 수 있어요.',
    dismiss: '나중에',
    after: '로그인하면 추천 요청 1단계로 이동해요',
  },
  compare: {
    title: '고른 곳들로 코스를 짜 드릴게요',
    body: '로그인하면 비교 중인 곳이 "꼭 포함할 장소"에 그대로 담겨요.',
    dismiss: '계속 비교하기',
    after: '로그인하면 추천 요청에 장소가 미리 채워져요',
  },
  trip: {
    title: '여행을 저장하려면 로그인이 필요해요',
    body: '여러 여행과 일정안을 만들고 구글 캘린더로 보낼 수 있어요.',
    dismiss: '계속 둘러보기',
    after: '로그인하면 어느 여행에 담을지 바로 물어봐요',
  },
}
