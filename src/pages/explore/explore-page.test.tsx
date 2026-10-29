import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('탐색 홈 (04)', () => {
  it('비교 트레이에서 빼면 개수와 체크가 함께 바뀐다', async () => {
    renderRoute('/explore')
    expect(await screen.findByText('비교')).toHaveTextContent('비교 2')
    await userEvent.click(screen.getByRole('button', { name: '정동야행 빼기' }))
    expect(screen.getByText('비교')).toHaveTextContent('비교 1')
    expect(screen.getByRole('checkbox', { name: '정동야행 비교에 담기' })).not.toBeChecked()
  })

  it('관광지 탭으로 바꾸면 주소와 목록이 바뀐다', async () => {
    const { router } = renderRoute('/explore')
    await userEvent.click(await screen.findByRole('tab', { name: /관광지/ }))
    expect(router.state.location.search).toBe('?tab=place')
    expect(await screen.findByText('오늘 운영')).toBeInTheDocument()
  })

  it('비로그인이 찜을 누르면 그 장소 이름으로 로그인 모달을 띄운다 (14-1)', async () => {
    renderRoute('/explore?guest=1')
    await userEvent.click(await screen.findByRole('button', { name: '한성백제문화제 찜하기' }))
    const dialog = screen.getByRole('dialog', { name: '로그인하고 찜해 두세요' })
    expect(within(dialog).getByText('한성백제문화제')).toBeInTheDocument()
  })
})
