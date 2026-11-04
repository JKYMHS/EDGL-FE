import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('상세 이미지 갤러리 (05) · FUNC-002-04', () => {
  it('+N을 누르면 3번째 사진부터 보고, 앞뒤로 넘긴다', async () => {
    renderRoute('/places/f-bitchorong')
    await userEvent.click(await screen.findByRole('button', { name: '사진 6장 더 보기' }))
    const dialog = screen.getByRole('dialog', { name: '서울빛초롱축제' })
    expect(within(dialog).getByText('3 / 8')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: '다음 사진' }))
    expect(within(dialog).getByText('4 / 8')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: '사진 1 보기' }))
    await userEvent.click(within(dialog).getByRole('button', { name: '이전 사진' }))
    expect(within(dialog).getByText('8 / 8')).toBeInTheDocument()
  })
})
