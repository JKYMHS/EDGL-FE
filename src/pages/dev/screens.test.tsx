import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/render-route'
import { DRAFT_SCREENS, SCREENS } from './screens'

/** 화면마다 디자인에 있는 대표 문구 */
const EXPECTED: Record<string, string> = {
  '00': '타이포그래피',
  '01': '저장한 일정과 찜을 이어서 볼 수 있어요',
  '02': '메일로 받은 6자리 코드를 입력하세요',
  '02-2': '약관에 동의해 주세요',
  '03': '어떤 여행을 좋아하세요?',
  '03-5': '이번 주말 축제',
  '03-6': '반경 1km 안의 축제와 관광지',
  '04': '이 장소들로 코스 추천',
  '04-2': '롯데월드타워 서울스카이',
  '05': '함께 가기 좋은 곳',
  '06': '찜한 곳',
  '06-2': '오늘 휴무 숨기기',
  '07-1': '어디로 갈까요?',
  '07-2': '언제 떠나세요?',
  '07-3': '어디서 출발하세요?',
  '07-4': '누구와 가세요?',
  '07-5': '꼭 가고 싶은 곳이 있나요?',
  '08': '코스를 짜고 있어요',
  '09': '고궁과 정동 야행 1박 2일',
  '10': '경로 다시 계산',
  '11-1': '여행마다 일정안을 여러 개 두고, 하나를 확정해요',
  '11-2': '일정안 추가',
  '11-4': '어디에 저장할까요?',
  '12': '구글 캘린더에 올리기',
  '13': '취향 설정',
  '14-1': '로그인하고 찜해 두세요',
  '14-2': '고른 곳들로 코스를 짜 드릴게요',
}

describe('기준 디자인 27개 화면', () => {
  it('화면 목록이 27개다', () => {
    expect(SCREENS).toHaveLength(27)
    expect(Object.keys(EXPECTED)).toHaveLength(27)
  })

  it.each(SCREENS.map((s) => [s.id, s.path] as const))(
    '%s (%s) 화면을 그린다',
    async (id, path) => {
      renderRoute(path)
      expect((await screen.findAllByText(EXPECTED[id], { exact: false })).length).toBeGreaterThan(0)
    },
  )
})

const DRAFT_EXPECTED: Record<string, string> = {
  'A-1': '계정을 만들어요',
  'A-2': '비밀번호를 잊으셨나요?',
  'A-3': '새 비밀번호를 정해 주세요',
  'A-4': '이미 가입한 계정이 있어요',
  'B-1': '하루에 몇 곳쯤 다닐까요?',
  'B-2': '여행 첫 일정은 언제 시작할까요?',
  'B-3': '이동이 편한 길이 필요하세요?',
  'B-4': '반려동물과 함께 다니세요?',
  'C-1': '정보 이용 동의',
  'C-2': '기본 캘린더',
  'C-3': '현재 비밀번호',
  'C-4': '로그아웃',
  'C-5': '회원 탈퇴',
  'D-1': '확정된 여행 3개를 캘린더에 올릴까요?',
  'D-2': '확정된 여행 3개를 캘린더에 올릴까요?',
  'E-1': '새 여행 만들기',
  'E-2': '어느 여행에 담을까요?',
  'E-3': '다녀온 곳과 만족도를 알려 주세요',
}

describe('디자인 없던 화면 18개 (시안)', () => {
  it('시안 목록이 18개다', () => {
    expect(DRAFT_SCREENS).toHaveLength(18)
    expect(Object.keys(DRAFT_EXPECTED)).toHaveLength(18)
  })

  it.each(DRAFT_SCREENS.map((s) => [s.id, s.path] as const))(
    '%s (%s) 화면을 그린다',
    async (id, path) => {
      renderRoute(path)
      expect(
        (await screen.findAllByText(DRAFT_EXPECTED[id], { exact: false })).length,
      ).toBeGreaterThan(0)
    },
  )
})
