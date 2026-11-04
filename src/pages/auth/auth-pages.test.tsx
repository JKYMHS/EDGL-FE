import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('회원가입 1단계 (A-1)', () => {
  it('이미 가입된 이메일이면 안내하고, 조건을 모두 채우면 2단계로 넘어간다', async () => {
    const { router } = renderRoute('/signup?step=1')
    expect(await screen.findByText(/이미 가입된 이메일이에요/)).toBeInTheDocument()
    const submit = screen.getByRole('button', { name: '인증 메일 받기' })
    expect(submit).toBeDisabled()

    const email = screen.getByLabelText('이메일')
    await userEvent.clear(email)
    await userEvent.type(email, 'new@example.com')
    const password = screen.getByLabelText('비밀번호')
    await userEvent.clear(password)
    await userEvent.type(password, 'trip2026')
    expect(screen.getByLabelText('숫자 포함 충족')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), 'trip2026')

    await userEvent.click(submit)
    expect(router.state.location.search).toBe('?step=2')
  })
})

describe('비밀번호 찾기 (A-2, A-3)', () => {
  it('틀린 코드는 남은 횟수를 보여 주고, 맞는 코드면 새 비밀번호 단계로 간다', async () => {
    const { router } = renderRoute('/password/reset')
    expect(await screen.findByText(/3번 더 입력할 수 있어요/)).toBeInTheDocument()
    const code = screen.getByLabelText('인증 코드 6자리')
    await userEvent.clear(code)
    await userEvent.type(code, '123456')
    await userEvent.click(screen.getByRole('button', { name: '확인' }))
    expect(router.state.location.search).toBe('?step=2')
    expect(screen.getByRole('heading', { name: '새 비밀번호를 정해 주세요' })).toBeInTheDocument()
  })

  it('새 비밀번호를 바꾸면 로그인 화면에 완료 알림이 뜬다', async () => {
    const { router } = renderRoute('/password/reset?step=2')
    await userEvent.type(await screen.findByLabelText('새 비밀번호'), 'trip2026')
    await userEvent.type(screen.getByLabelText('새 비밀번호 확인'), 'trip2026')
    await userEvent.click(screen.getByRole('button', { name: '비밀번호 바꾸기' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
    expect(await screen.findByRole('status')).toHaveTextContent('비밀번호를 바꿨어요')
  })
})
