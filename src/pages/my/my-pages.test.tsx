import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('마이페이지 계정 (C-1)', () => {
  it('행동 데이터를 끄면 삭제 안내를 거쳐 꺼진다', async () => {
    renderRoute('/my/account')
    const toggle = await screen.findByRole('switch', { name: '행동 데이터 수집·이용' })
    await userEvent.click(toggle)
    const dialog = screen.getByRole('dialog', { name: '행동 데이터 수집을 끌까요?' })
    expect(toggle).toBeChecked()
    await userEvent.click(within(dialog).getByRole('button', { name: '끄고 삭제하기' }))
    expect(toggle).not.toBeChecked()
  })
})

describe('캘린더 연동 (C-2) → 일괄 업로드 (D-1, D-2)', () => {
  it('연결하면 일괄 업로드가 열리고, 실패한 것만 다시 올린다', async () => {
    renderRoute('/my/calendar?state=disconnected')
    await userEvent.click(await screen.findByRole('button', { name: '구글 캘린더 연결' }))
    const dialog = screen.getByRole('dialog', { name: '확정된 여행 3개를 캘린더에 올릴까요?' })
    expect(within(dialog).getByRole('checkbox', { name: /가을 억새 하늘공원/ })).toHaveAttribute(
      'aria-checked',
      'false',
    )

    await userEvent.click(within(dialog).getByRole('button', { name: '2개 여행 올리기' }))
    expect(screen.getByRole('dialog', { name: '일정 13개를 올렸어요' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '실패한 1개 다시 올리기' }))
    expect(screen.getByRole('dialog', { name: '일정 14개를 올렸어요' })).toBeInTheDocument()
  })

  it('연동 해제는 올린 일정 처리 방법을 고른다', async () => {
    renderRoute('/my/calendar')
    await userEvent.click(await screen.findByRole('button', { name: '연동 해제' }))
    const dialog = screen.getByRole('dialog', { name: '캘린더 연동을 해제할까요?' })
    await userEvent.click(within(dialog).getByRole('radio', { name: /모두 지우기/ }))
    await userEvent.click(within(dialog).getByRole('button', { name: '연동 해제' }))
    expect(screen.getByRole('button', { name: '구글 캘린더 연결' })).toBeInTheDocument()
  })
})

describe('사이드 메뉴 (C-4, C-5)', () => {
  it('로그아웃은 확인 후 로그인 화면으로 간다', async () => {
    const { router } = renderRoute('/my/preferences')
    await userEvent.click(await screen.findByRole('button', { name: '로그아웃' }))
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '로그아웃' }),
    )
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
  })

  it('회원 탈퇴는 안내 확인 → 본인 확인 → 최종 확인 순서로 간다', async () => {
    renderRoute('/my/preferences')
    await userEvent.click(await screen.findByRole('button', { name: '회원 탈퇴' }))
    const next = screen.getByRole('button', { name: '다음: 본인 확인' })
    expect(next).toBeDisabled()
    await userEvent.click(screen.getByRole('checkbox', { name: '위 내용을 확인했어요' }))
    await userEvent.click(next)
    await userEvent.type(screen.getByLabelText('비밀번호'), 'trip2026')
    await userEvent.click(screen.getByRole('button', { name: '다음: 최종 확인' }))
    expect(screen.getByRole('button', { name: '탈퇴하기' })).toBeInTheDocument()
  })
})
