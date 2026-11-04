import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

const PATH = '/trips/t-palace'

async function planMenu(plan: string, item: string) {
  await userEvent.click(await screen.findByRole('button', { name: `${plan} 메뉴` }))
  await userEvent.click(await screen.findByRole('menuitem', { name: new RegExp(item) }))
}

const planRow = (name: string) =>
  screen.getAllByRole('row').find((r) => r.textContent?.includes(name))!

describe('여행 상세 (11-2) · FUNC-004-04, 05', () => {
  it('여행 정보를 고치면 제목과 기간이 바뀐다', async () => {
    renderRoute(PATH)
    await userEvent.click(await screen.findByRole('button', { name: '여행 정보 수정' }))
    const dialog = screen.getByRole('dialog', { name: '여행 정보 수정' })
    const name = within(dialog).getByLabelText('여행 이름')
    await userEvent.clear(name)
    await userEvent.type(name, '정동 야행 주말')
    await userEvent.clear(within(dialog).getByLabelText('오는 날'))
    await userEvent.type(within(dialog).getByLabelText('오는 날'), '2026-10-26')
    await userEvent.click(within(dialog).getByRole('button', { name: '저장' }))
    expect(screen.getByRole('heading', { name: '정동 야행 주말' })).toBeInTheDocument()
    expect(screen.getByText('10.24 – 10.26')).toBeInTheDocument()
  })

  it('초안을 확정으로 바꾸면 기존 확정안은 초안이 된다', async () => {
    renderRoute(PATH)
    await planMenu('비 오는 날 코스', '확정으로 바꾸기')
    await userEvent.click(screen.getByRole('button', { name: '확정하기' }))
    expect(within(planRow('비 오는 날 코스')).getByText('확정')).toBeInTheDocument()
    expect(within(planRow('기본 코스')).getByText('초안')).toBeInTheDocument()
  })

  it('확정안 메뉴에는 "확정으로 바꾸기"가 없다', async () => {
    renderRoute(PATH)
    await userEvent.click(await screen.findByRole('button', { name: '기본 코스 메뉴' }))
    expect(await screen.findByRole('menuitem', { name: '이름 바꾸기' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: '확정으로 바꾸기' })).not.toBeInTheDocument()
  })

  it('이름 바꾸기·복제·삭제', async () => {
    renderRoute(PATH)
    await planMenu('정동 중심 여유 코스', '이름 바꾸기')
    const input = screen.getByRole('textbox', { name: '일정안 이름' })
    await userEvent.clear(input)
    await userEvent.type(input, '정동 산책')
    await userEvent.click(screen.getByRole('button', { name: '바꾸기' }))
    expect(planRow('정동 산책')).toBeTruthy()

    await planMenu('정동 산책', '복제')
    expect(planRow('정동 산책 사본')).toHaveTextContent('초안')

    await planMenu('정동 산책 사본', '삭제')
    await userEvent.click(screen.getByRole('button', { name: '삭제' }))
    await waitFor(() =>
      expect(screen.getAllByRole('row').some((r) => r.textContent?.includes('사본'))).toBe(false),
    )
  })

  it('일정안 추가 → 직접 만들기는 빈 일정안 편집으로 간다', async () => {
    const { router } = renderRoute(PATH)
    await userEvent.click(await screen.findByRole('button', { name: /일정안 추가/ }))
    await userEvent.click(await screen.findByRole('menuitem', { name: /직접 만들기/ }))
    await waitFor(() => expect(router.state.location.pathname).toMatch(/\/plans\/p-new-\d+\/edit$/))
    expect(await screen.findByText('이 날은 아직 장소가 없어요')).toBeInTheDocument()
  })

  it('여행 삭제는 확인 후 내 여행으로 간다', async () => {
    const { router } = renderRoute(PATH)
    await userEvent.click(await screen.findByRole('button', { name: '여행 메뉴' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: '여행 삭제' }))
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '여행 삭제' }),
    )
    await waitFor(() => expect(router.state.location.pathname).toBe('/trips'))
  })
})
