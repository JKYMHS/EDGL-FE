import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

const PATH = '/trips/t-palace/plans/p-basic/edit'

const names = () =>
  within(screen.getByRole('list', { name: '1일차 일정' }))
    .getAllByRole('listitem')
    .map((li) => li.querySelector('.text-\\[15px\\]')?.textContent)
    .filter(Boolean)

async function openMenu(name: string, item: string) {
  await userEvent.click(await screen.findByRole('button', { name: `${name} 메뉴` }))
  await userEvent.click(await screen.findByRole('menuitem', { name: item }))
}

describe('일정 편집 (10) · FUNC-004-02', () => {
  it('처음에는 변경 0, 임시 직선 안내가 없다', async () => {
    renderRoute(PATH)
    expect(await screen.findByText(/저장 안 된 변경/)).toHaveTextContent('저장 안 된 변경 0')
    expect(screen.queryByRole('button', { name: '경로 다시 계산' })).not.toBeInTheDocument()
  })

  it('손잡이를 키보드로 끌어 순서를 바꾸면 임시 직선이 되고, 다시 계산하면 사라진다', async () => {
    // jsdom은 크기가 0이라 항목마다 세로 위치를 준다
    const spy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    spy.mockImplementation(function (this: HTMLElement) {
      const li = this.closest('li')
      const index = li ? Array.from(li.parentElement!.children).indexOf(li) : 0
      const top = index * 60
      return {
        x: 0,
        y: top,
        top,
        left: 0,
        width: 600,
        height: 56,
        right: 600,
        bottom: top + 56,
        toJSON() {},
      } as DOMRect
    })
    renderRoute(PATH)
    const handle = await screen.findByRole('button', { name: '경복궁 끌어서 순서 바꾸기' })
    handle.focus()
    const press = async (code: string) => {
      await act(async () => {
        fireEvent.keyDown(handle, { key: code === 'Space' ? ' ' : code, code })
        await new Promise((r) => setTimeout(r, 20))
      })
    }
    await press('Space')
    await press('ArrowDown')
    await press('Space')
    spy.mockRestore()

    expect(names().slice(0, 2)).toEqual(['북촌 한옥마을', '경복궁'])
    expect(screen.getByText(/저장 안 된 변경/)).toHaveTextContent('저장 안 된 변경 1')
    await userEvent.click(screen.getByRole('button', { name: '경로 다시 계산' }))
    expect(screen.queryByRole('button', { name: '경로 다시 계산' })).not.toBeInTheDocument()
    expect(screen.getByText('1일차 경로와 시각을 다시 계산했어요')).toBeInTheDocument()
  })

  it('다른 일차로 옮기면 그 일차 끝에 붙는다', async () => {
    renderRoute(PATH)
    await openMenu('경복궁', '2일차로 옮기기')
    expect(names()).not.toContain('경복궁')
    await userEvent.click(screen.getByRole('tab', { name: /2일차/ }))
    const day2 = screen.getByRole('list', { name: '2일차 일정' })
    expect(within(day2).getAllByRole('listitem').at(-2)).toHaveTextContent('경복궁')
  })

  it('체류 시간을 바꾸면 끝나는 시각이 바뀐다', async () => {
    renderRoute(PATH)
    await openMenu('경복궁', '체류 시간 바꾸기')
    const dialog = screen.getByRole('dialog', { name: '체류 시간 바꾸기' })
    await userEvent.click(within(dialog).getByRole('radio', { name: '2시간' }))
    await userEvent.click(within(dialog).getByRole('button', { name: '바꾸기' }))
    expect(screen.getByText('10:00 – 12:00')).toBeInTheDocument()
  })

  it('메모를 남기면 항목 아래에 보이고 메뉴가 "메모 수정"이 된다', async () => {
    renderRoute(PATH)
    await openMenu('경복궁', '메모 추가')
    await userEvent.type(screen.getByRole('textbox', { name: '메모' }), '수문장 교대식 10시')
    await userEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(screen.getByText('수문장 교대식 10시')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '경복궁 메뉴' }))
    expect(await screen.findByRole('menuitem', { name: '메모 수정' })).toBeInTheDocument()
  })

  it('삭제하면 빠지고, 되돌리기로 돌아온다', async () => {
    renderRoute(PATH)
    await openMenu('덕수궁', '삭제')
    expect(names()).not.toContain('덕수궁')
    await userEvent.click(screen.getByRole('button', { name: '되돌리기' }))
    expect(names()).toContain('덕수궁')
  })

  it('장소 추가에서 검색해 넣으면 일차 끝에 붙고 "추가됨"이 된다', async () => {
    renderRoute(PATH)
    await userEvent.click(await screen.findByRole('button', { name: /장소 추가/ }))
    const dialog = screen.getByRole('dialog', { name: '장소 추가' })
    await userEvent.click(within(dialog).getByRole('tab', { name: '검색' }))
    await userEvent.type(within(dialog).getByRole('textbox', { name: '장소 검색' }), '청계')
    await userEvent.click(within(dialog).getByRole('button', { name: '청계천 추가' }))
    expect(within(dialog).getByRole('button', { name: '청계천 추가됨' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    expect(names().at(-1)).toBe('청계천')
  })

  it('바꾼 게 있으면 취소할 때 확인한다', async () => {
    renderRoute(PATH)
    await openMenu('덕수궁', '삭제')
    await userEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(screen.getByRole('dialog', { name: '저장하지 않고 나갈까요?' })).toBeInTheDocument()
  })

  it('디자인 10 상태(?state=reordered)는 끌던 중과 임시 직선을 보여 준다', async () => {
    renderRoute(`${PATH}?state=reordered`)
    expect(await screen.findByRole('button', { name: '경로 다시 계산' })).toBeInTheDocument()
    expect(screen.getByText(/저장 안 된 변경/)).toHaveTextContent('저장 안 된 변경 3')
  })
})
