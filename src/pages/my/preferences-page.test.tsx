import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('마이페이지 취향 설정 (13)', () => {
  it('바뀐 항목을 트레이에 보이고 되돌리면 트레이가 사라진다', async () => {
    renderRoute('/my/preferences')
    expect(await screen.findByText(/반려동물, 스타일/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '되돌리기' }))
    expect(screen.queryByText(/바뀐 항목/)).not.toBeInTheDocument()
  })
})
