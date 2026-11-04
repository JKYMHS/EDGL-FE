import { useState } from 'react'

export type LocateStatus = 'idle' | 'locating' | 'denied' | 'unavailable'

/**
 * 현재 위치 → 주소 (FUNC-003-01). 좌표는 주소로 바꾸는 데만 쓰고 저장하지 않는다.
 * 주소 변환(역지오코딩)은 카카오 SDK를 붙일 때 resolveAddress로 바꾼다.
 */
export function useCurrentLocation(resolveAddress: (lat: number, lng: number) => Promise<string>) {
  const [status, setStatus] = useState<LocateStatus>('idle')

  const locate = () =>
    new Promise<string | undefined>((resolve) => {
      if (!('geolocation' in navigator)) {
        setStatus('unavailable')
        resolve(undefined)
        return
      }
      setStatus('locating')
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const address = await resolveAddress(coords.latitude, coords.longitude)
          setStatus('idle')
          resolve(address)
        },
        (error) => {
          setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable')
          resolve(undefined)
        },
        { timeout: 10_000, maximumAge: 60_000 },
      )
    })

  return { status, locate }
}
