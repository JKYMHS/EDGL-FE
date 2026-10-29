import { screen } from '@testing-library/react'
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
