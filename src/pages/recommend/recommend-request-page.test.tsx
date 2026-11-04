import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('추천 요청 5단계 (07)', () => {
  it('다음·이전으로 단계를 오가고 고른 값을 트레이에 모은다', async () => {
    const { router } = renderRoute('/recommend?step=1')
    expect(await screen.findByRole('heading', { name: '어디로 갈까요?' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '다음' }))
    expect(screen.getByRole('heading', { name: '언제 떠나세요?' })).toBeInTheDocument()
    expect(router.state.location.search).toBe('?step=2')
    expect(screen.getByText(/1박 2일/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '이전' }))
    expect(screen.getByRole('heading', { name: '어디로 갈까요?' })).toBeInTheDocument()
  })

  it('오는 날을 고르기 전에는 다음으로 갈 수 없다', async () => {
    renderRoute('/recommend?step=2')
    await userEvent.click(await screen.findByRole('gridcell', { name: /^28/ }))
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled()
    await userEvent.click(screen.getByRole('gridcell', { name: /^30/ }))
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled()
  })

  it('지역 구·군 칩을 끄고 켤 수 있다', async () => {
    renderRoute('/recommend?step=1')
    const chip = await screen.findByRole('button', { name: '중구' })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'false')
  })
})
