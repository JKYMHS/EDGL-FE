import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { LOGIN_GATE_COPY, type LoginGateReason } from '../model/login-gate'
import { LoginRequiredModal } from './login-required-modal'

function renderModal(reason: LoginGateReason, targetName?: string) {
  const onOpenChange = vi.fn()
  render(
    <MemoryRouter>
      <LoginRequiredModal
        open
        onOpenChange={onOpenChange}
        reason={reason}
        targetName={targetName}
      />
    </MemoryRouter>,
  )
  return { onOpenChange }
}

describe('LoginRequiredModal (디자인 14-1, 14-2)', () => {
  it.each(Object.keys(LOGIN_GATE_COPY) as LoginGateReason[])(
    '%s 상황 문구를 보여 준다',
    (reason) => {
      renderModal(reason)
      const copy = LOGIN_GATE_COPY[reason]
      expect(screen.getByRole('dialog', { name: copy.title })).toBeInTheDocument()
      expect(screen.getByText(copy.after)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: copy.dismiss })).toBeInTheDocument()
    },
  )

  it('찜하려던 장소 이름을 설명에 넣는다', () => {
    renderModal('wish', '서울빛초롱축제')
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription(
      '서울빛초롱축제를 찜 목록에 저장하려면 로그인이 필요해요.',
    )
  })

  it('보조 버튼을 누르면 닫힌다', async () => {
    const { onOpenChange } = renderModal('recommend')
    await userEvent.click(screen.getByRole('button', { name: '나중에' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('로그인·회원가입으로 이동하는 링크가 있다', () => {
    renderModal('trip')
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup')
  })
})
