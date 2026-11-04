import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('마이페이지 — 찜한 곳 (06, 06-2) · FUNC-002-06, 08', () => {
  it('마이페이지 첫 화면이고, 사이드 메뉴 맨 위에 있다', async () => {
    const { router } = renderRoute('/my')
    await waitFor(() => expect(router.state.location.pathname).toBe('/my/likes'))
    expect(await screen.findByRole('heading', { name: '찜한 곳' })).toBeInTheDocument()
    const menu = screen.getByRole('navigation', { name: '마이페이지' })
    const links = within(menu).getAllByRole('link')
    expect(links[0]).toHaveTextContent('찜한 곳')
    expect(links[0]).toHaveAttribute('aria-current', 'page')
  })

  it('예전 /likes 주소는 탭을 유지한 채 /my/likes로 넘어간다', async () => {
    const { router } = renderRoute('/likes?tab=place')
    await waitFor(() => expect(router.state.location.pathname).toBe('/my/likes'))
    expect(router.state.location.search).toBe('?tab=place')
    expect(await screen.findByRole('tab', { name: /관광지/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('카드 체크로 비교에 담고 빼면 트레이와 요약이 함께 바뀐다', async () => {
    renderRoute('/my/likes?tab=place')
    expect(await screen.findByText('비교', { selector: 'span' })).toHaveTextContent('비교 2')
    const note = screen.getByRole('note', { name: '비교 요약' })
    expect(note).toHaveTextContent('비교 중인 2곳')

    await userEvent.click(screen.getByRole('checkbox', { name: '경복궁 비교에 담기' }))
    expect(screen.getByText('비교', { selector: 'span' })).toHaveTextContent('비교 1')
    expect(note).toHaveTextContent('비교 중인 1곳')
  })

  it('카드를 누르면 선택되고, 지도 마커와 번호가 같다', async () => {
    renderRoute('/my/likes')
    const list = await screen.findByRole('list', { name: '찜한 곳 목록' })
    const card = within(list).getByRole('listitem', { name: '정동야행' })
    expect(card).not.toHaveAttribute('aria-current')
    await userEvent.click(card)
    expect(card).toHaveAttribute('aria-current', 'true')
    expect(within(card).getByText('2')).toBeInTheDocument()
  })

  it('종료된 축제 숨기기를 켜면 종료된 카드가 빠진다', async () => {
    renderRoute('/my/likes')
    const list = await screen.findByRole('list', { name: '찜한 곳 목록' })
    const before = within(list).getAllByRole('listitem').length
    await userEvent.click(screen.getByRole('switch', { name: '종료된 축제 숨기기' }))
    expect(within(list).getAllByRole('listitem').length).toBeLessThan(before)
    expect(within(list).queryByText('종료')).not.toBeInTheDocument()
  })

  it('하트를 누르면 찜을 빼고, 다시 누르면 되돌린다', async () => {
    renderRoute('/my/likes')
    await userEvent.click(await screen.findByRole('button', { name: '정동야행 찜 빼기' }))
    expect(screen.getByRole('button', { name: '정동야행 찜하기' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
