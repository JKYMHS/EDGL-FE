import { act, screen, waitFor, within } from '@testing-library/react'
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

describe('이메일 인증 코드 (02, A-2) · FUNC-001-06', () => {
  afterEach(() => vi.useRealTimers())

  it('쿨타임이 끝나면 코드를 다시 받을 수 있고, 남은 시간이 처음부터 다시 간다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderRoute('/signup?step=2')
    const resend = await screen.findByRole('button', { name: /코드 다시 받기/ })
    expect(resend).toBeDisabled()
    expect(resend).toHaveTextContent('(52초)')

    await act(() => vi.advanceTimersByTimeAsync(52_000))
    expect(resend).toBeEnabled()
    expect(screen.getByText('03:40')).toBeInTheDocument()

    await user.click(resend)
    expect(screen.getByText('05:00')).toBeInTheDocument()
    expect(resend).toHaveTextContent('(60초)')
    expect(screen.getByText(/새 코드를 보냈어요/)).toBeInTheDocument()
  })

  it('유효 시간이 지나면 만료를 알리고 확인을 막는다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderRoute('/signup?step=2')
    await screen.findByRole('button', { name: /코드 다시 받기/ })
    await act(() => vi.advanceTimersByTimeAsync(272_000))
    expect(screen.getByRole('alert')).toHaveTextContent('코드가 만료됐어요')
    expect(screen.getByRole('button', { name: '확인' })).toBeDisabled()
  })

  it('이메일 바꾸기는 1단계로 돌아간다', async () => {
    const { router } = renderRoute('/signup?step=2')
    await userEvent.click(await screen.findByRole('button', { name: '이메일 바꾸기' }))
    expect(router.state.location.search).toBe('?step=1')
  })

  it('비밀번호 찾기에서도 쿨타임 뒤 다시 받는다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderRoute('/password/reset')
    const resend = await screen.findByRole('button', { name: /다시 받기/ })
    expect(resend).toBeDisabled()
    await act(() => vi.advanceTimersByTimeAsync(41_000))
    await user.click(resend)
    expect(screen.getByText(/새 코드를 보냈어요/)).toBeInTheDocument()
  })
})

describe('약관 보기 (02-2) · FUNC-001-05', () => {
  it('보기에서 본문을 보고, 동의를 누르면 체크된다', async () => {
    renderRoute('/signup?step=3')
    const checkbox = await screen.findByRole('checkbox', { name: '위치 정보 이용' })
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    await userEvent.click(screen.getByRole('button', { name: '위치 정보 이용 보기' }))
    const dialog = screen.getByRole('dialog', { name: '위치 정보 이용' })
    expect(dialog).toHaveTextContent('좌표는 저장하지 않아요')
    await userEvent.click(within(dialog).getByRole('button', { name: '동의' }))
    expect(checkbox).toBeChecked()
  })
})
