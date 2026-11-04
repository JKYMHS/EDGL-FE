import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('추천 결과 (09) · FUNC-003-05, 10', () => {
  afterEach(() => vi.useRealTimers())

  it('다시 추천하면 횟수가 1 늘고, 직전 결과로 돌아갈 수 있다', { timeout: 30_000 }, async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const { router } = renderRoute('/recommend/r-demo')
    await user.click(await screen.findByRole('button', { name: /다시 추천\s*6\/10/ }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '다시 추천' }))
    expect(router.state.location.search).toBe('?status=pending')
    expect(await screen.findByText('코스를 짜고 있어요')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(20_000))

    expect(await screen.findByRole('button', { name: /다시 추천\s*7\/10/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '직전 결과로 돌아가기' }))
    expect(screen.queryByText('같은 조건으로 다시 추천한 코스예요')).not.toBeInTheDocument()
  })

  it('식사 시간에서 음식점을 고르면 슬롯에 들어가고 바꿀 수 있다', async () => {
    renderRoute('/recommend/r-demo')
    await userEvent.click(await screen.findByRole('button', { name: /주변 음식점 8곳 보기/ }))
    await userEvent.click(screen.getByRole('button', { name: /북촌 손만두/ }))
    expect(screen.getByText('북촌 손만두')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '바꾸기' })).toHaveLength(1)
  })
})
