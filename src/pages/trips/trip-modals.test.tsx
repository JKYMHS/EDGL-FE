import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('새 여행 만들기 (E-1)', () => {
  it('이름·기간·동행을 채워야 만들 수 있다', async () => {
    renderRoute('/trips')
    await userEvent.click(await screen.findByRole('button', { name: '새 여행' }))
    const dialog = screen.getByRole('dialog', { name: '새 여행 만들기' })
    const create = within(dialog).getByRole('button', { name: '만들기' })
    expect(create).toBeDisabled()

    await userEvent.type(within(dialog).getByLabelText('여행 이름'), '부산 바다')
    expect(within(dialog).getByText('5/30')).toBeInTheDocument()
    await userEvent.type(within(dialog).getByLabelText('가는 날'), '2026-12-19')
    await userEvent.type(within(dialog).getByLabelText('오는 날'), '2026-12-21')
    expect(within(dialog).getByText('2박 3일')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: '친구' }))
    expect(create).toBeEnabled()
  })
})

describe('방문 확인 (E-3)', () => {
  it('못 갔어요를 고르면 별점이 꺼지고, 저장하면 배너가 사라진다', async () => {
    renderRoute('/trips?modal=visit')
    const dialog = await screen.findByRole('dialog', { name: '고궁과 정동 야행' })
    expect(within(dialog).getByRole('radiogroup', { name: '경복궁 만족도' })).toBeInTheDocument()

    await userEvent.click(
      within(within(dialog).getByRole('radiogroup', { name: '경복궁 방문 여부' })).getByRole(
        'radio',
        {
          name: '못 갔어요',
        },
      ),
    )
    expect(
      within(dialog).queryByRole('radiogroup', { name: '경복궁 만족도' }),
    ).not.toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: '저장' }))
    expect(screen.queryByText(/다녀오셨나요/)).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('방문 2/9을 저장했어요')
  })
})

describe('기존 여행에 장소 추가 (E-2)', () => {
  it('축제 기간과 겹치는 여행을 먼저 고르고, 담으면 알림을 띄운다', async () => {
    renderRoute('/places/f-bitchorong')
    await userEvent.click(await screen.findByRole('button', { name: '일정에 추가' }))
    const dialog = screen.getByRole('dialog', { name: '어느 여행에 담을까요?' })
    expect(within(dialog).getByRole('radio', { name: /빛초롱 보러 가는 청계천/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await userEvent.click(within(dialog).getByRole('button', { name: '담기' }))
    expect(screen.getByRole('status')).toHaveTextContent('빛초롱 보러 가는 청계천에 담았어요')
  })
})
