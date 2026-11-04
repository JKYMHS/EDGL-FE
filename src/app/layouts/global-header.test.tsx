import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('GlobalHeader', () => {
  it('로그인 상태면 프로필, 지금 메뉴를 표시한다', async () => {
    renderRoute('/trips')
    expect(await screen.findByRole('link', { name: '마이페이지' })).toHaveAttribute(
      'href',
      '/my/likes',
    )
    expect(screen.getByRole('link', { name: '내 여행' })).toHaveAttribute('aria-current', 'page')
  })

  it('찜은 상단 메뉴가 아니라 마이페이지 안에 있다', async () => {
    renderRoute('/explore')
    const nav = await screen.findByRole('navigation', { name: '주요 메뉴' })
    expect(within(nav).queryByRole('link', { name: '찜' })).not.toBeInTheDocument()
  })

  it('비로그인이면 로그인·회원가입을 보이고, 로그인 필요 메뉴는 모달을 띄운다 (PRD 5.0)', async () => {
    const { router } = renderRoute('/explore?guest=1')
    expect(await screen.findByRole('link', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '회원가입' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: /AI 추천/ }))
    expect(
      screen.getByRole('dialog', { name: 'AI 코스 추천은 로그인 후에 쓸 수 있어요' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/explore')
  })
})
