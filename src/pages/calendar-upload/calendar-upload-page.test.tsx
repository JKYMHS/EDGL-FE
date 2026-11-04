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

describe('캘린더 업로드 동작 · FUNC-005-03, 003-10', () => {
  it('올릴 캘린더를 바꾸고, 올리면 그 캘린더 이름으로 결과를 알린다', async () => {
    renderRoute('/trips/t-palace/calendar')
    await userEvent.click(await screen.findByRole('button', { name: /캘린더: 여행/ }))
    await userEvent.click(await screen.findByRole('menuitem', { name: '가족' }))
    expect(screen.getByRole('button', { name: /캘린더: 가족/ })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '7개 올리기' }))
    expect(screen.getByText(/"가족" 캘린더에 일정 7개를 올렸어요/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '0개 올리기' })).toBeDisabled()
  })

  it('식사 슬롯에서 음식점을 고르면 올릴 항목이 된다', async () => {
    renderRoute('/trips/t-palace/calendar')
    await userEvent.click(await screen.findByRole('button', { name: '고르기' }))
    await userEvent.click(screen.getByRole('button', { name: /삼청동 수제비/ }))
    expect(screen.getByRole('checkbox', { name: '삼청동 수제비 올리기' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('button', { name: '8개 올리기' })).toBeInTheDocument()
    expect(screen.queryByText(/장소 미선택이라 제외/)).not.toBeInTheDocument()
  })
})
