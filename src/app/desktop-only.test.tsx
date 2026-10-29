import { act, render, screen } from '@testing-library/react'
import { DesktopOnly } from './desktop-only'

function setWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
}

describe('DesktopOnly', () => {
  afterEach(() => setWidth(1024))

  it('1280px 이상이면 내용을 그린다', () => {
    setWidth(1440)
    render(<DesktopOnly>본문</DesktopOnly>)
    expect(screen.getByText('본문')).toBeInTheDocument()
  })

  it('1280px 미만이면 안내 화면만 그린다', () => {
    setWidth(1279)
    render(<DesktopOnly>본문</DesktopOnly>)
    expect(screen.queryByText('본문')).not.toBeInTheDocument()
    expect(screen.getByText('더 넓은 화면에서 이용해 주세요')).toBeInTheDocument()
  })

  it('창 크기가 바뀌면 다시 판단한다', () => {
    setWidth(1440)
    render(<DesktopOnly>본문</DesktopOnly>)
    act(() => {
      setWidth(1000)
      window.dispatchEvent(new Event('resize'))
    })
    expect(screen.queryByText('본문')).not.toBeInTheDocument()
  })
})
