import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('캘린더 일괄 업로드 (12)', () => {
  it('동기화된 항목을 빼고 올릴 개수를 센다', async () => {
    renderRoute('/trips/t-palace/calendar')
    expect(await screen.findByRole('button', { name: '7개 올리기' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: '덕수궁 올리기' })).toHaveAttribute(
      'aria-checked',
      'false',
    )

    await userEvent.click(screen.getByRole('checkbox', { name: '경복궁 올리기' }))
    expect(screen.getByRole('button', { name: '6개 올리기' })).toBeInTheDocument()
  })
})
