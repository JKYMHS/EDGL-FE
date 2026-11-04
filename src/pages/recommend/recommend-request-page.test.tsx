import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/render-route'

describe('추천 요청 5단계 (07)', () => {
  it('다음·이전으로 단계를 오가고 고른 값을 트레이에 모은다', async () => {
    const { router } = renderRoute('/recommend?step=1')
    expect(await screen.findByRole('heading', { name: '어디로 갈까요?' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '다음' }))
    expect(screen.getByRole('heading', { name: '언제 떠나세요?' })).toBeInTheDocument()
    expect(router.state.location.search).toBe('?step=2')
    expect(screen.getByText(/1박 2일/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '이전' }))
    expect(screen.getByRole('heading', { name: '어디로 갈까요?' })).toBeInTheDocument()
  })

  it('오는 날을 고르기 전에는 다음으로 갈 수 없다', async () => {
    renderRoute('/recommend?step=2')
    await userEvent.click(await screen.findByRole('gridcell', { name: /^28/ }))
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled()
    await userEvent.click(screen.getByRole('gridcell', { name: /^30/ }))
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled()
  })

  it('지역 구·군 칩을 끄고 켤 수 있다', async () => {
    renderRoute('/recommend?step=1')
    const chip = await screen.findByRole('button', { name: '중구' })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'false')
  })

  it('다음 달·오늘로·달 고르기로 달력을 옮긴다 (이번 달 이전은 막힌다)', async () => {
    renderRoute('/recommend?step=2')
    expect(await screen.findByRole('grid', { name: '2026년 10월' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '이전 달' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: '다음 달' }))
    expect(screen.getByRole('grid', { name: '2026년 11월' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '이전 달' })).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: /달 고르기/ }))
    await userEvent.click(screen.getByRole('button', { name: '12월' }))
    expect(screen.getByRole('grid', { name: '2026년 12월' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /연도 고르기/ }))
    await userEvent.click(screen.getByRole('option', { name: '2027년' }))
    // 1년 뒤(2027년 10월)까지만 고를 수 있다
    expect(screen.getByRole('grid', { name: '2027년 10월' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: '오늘로' }))
    expect(screen.getByRole('grid', { name: '2026년 10월' })).toBeInTheDocument()
  })

  it('현재 위치를 쓰면 주소로 바꿔 출발지로 고른다', async () => {
    const getCurrentPosition = vi.fn((ok: PositionCallback) =>
      ok({ coords: { latitude: 37.56, longitude: 126.97 } } as GeolocationPosition),
    )
    vi.stubGlobal('navigator', { ...navigator, geolocation: { getCurrentPosition } })
    renderRoute('/recommend?step=3')
    await userEvent.click(await screen.findByRole('button', { name: /현재 위치 사용하기/ }))
    const option = await screen.findByRole('option', { name: /서울 중구 세종대로 110 근처/ })
    expect(option).toHaveAttribute('aria-selected', 'true')
    vi.unstubAllGlobals()
  })

  it('위치 권한이 거부되면 안내한다', async () => {
    const getCurrentPosition = vi.fn((_: PositionCallback, fail: PositionErrorCallback) =>
      fail({ code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError),
    )
    vi.stubGlobal('navigator', { ...navigator, geolocation: { getCurrentPosition } })
    renderRoute('/recommend?step=3')
    await userEvent.click(await screen.findByRole('button', { name: /현재 위치 사용하기/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('위치 권한이 꺼져 있어요')
    vi.unstubAllGlobals()
  })

  it('지역 검색으로 시·도와 구·군을 거르고, +17로 나머지 구를 펼친다', async () => {
    renderRoute('/recommend?step=1')
    await userEvent.click(await screen.findByRole('button', { name: '구·군 17개 더 보기' }))
    expect(screen.getByRole('button', { name: '은평구' })).toBeInTheDocument()
    await userEvent.type(screen.getByRole('textbox', { name: '지역 이름으로 찾기' }), '서초')
    expect(screen.getByRole('button', { name: '서초구' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '은평구' })).not.toBeInTheDocument()
  })

  it('꼭 포함할 장소를 이름으로 찾아 담는다', async () => {
    renderRoute('/recommend?step=5')
    await userEvent.type(await screen.findByRole('textbox', { name: '장소 이름으로 추가' }), '남산')
    expect(screen.getByText('검색 결과')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('checkbox', { name: '남산서울타워 담기' }))
    expect(screen.getByRole('button', { name: '남산서울타워 빼기' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '장소 이름으로 추가' })).toHaveValue('')
  })
})
