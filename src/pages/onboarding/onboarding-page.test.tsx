import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('온보딩 취향 입력 (03)', () => {
  it('여행 스타일은 3개까지만 고를 수 있다', async () => {
    renderRoute('/onboarding')
    const shopping = await screen.findByRole('button', { name: /쇼핑/ })
    await userEvent.click(shopping)
    expect(shopping).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(screen.getByRole('button', { name: /자연/ }))
    await userEvent.click(shopping)
    expect(shopping).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('온보딩 2~5단계 (B-1~B-4)', () => {
  it('고른 값을 마지막 단계에 요약하고 시작하기로 홈에 간다', async () => {
    const { router } = renderRoute('/onboarding?step=2')
    await userEvent.click(await screen.findByRole('radio', { name: /여유롭게/ }))
    await userEvent.click(screen.getByRole('button', { name: '다음' }))
    await userEvent.click(screen.getByRole('radio', { name: /이른 아침/ }))
    await userEvent.click(screen.getByRole('button', { name: '다음' }))
    await userEvent.click(screen.getByRole('switch', { name: '계단이 적고 평탄한 길 위주로 짜기' }))
    await userEvent.click(screen.getByRole('button', { name: '다음' }))

    const summary = screen.getByRole('region', { name: '고른 취향' })
    expect(summary).toHaveTextContent('여유롭게 · 2~3곳')
    expect(summary).toHaveTextContent('이른 아침 09:00')
    expect(summary).toHaveTextContent('이동 편의켬')

    await userEvent.click(screen.getByRole('button', { name: '시작하기' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })
})
