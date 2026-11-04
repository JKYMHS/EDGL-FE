import { useEffect, useState } from 'react'

/** 1초마다 줄어드는 남은 초. restart로 다시 센다 (인증 코드 유효 시간·재전송 쿨타임) */
export function useCountdown(initialSeconds: number) {
  const [left, setLeft] = useState(initialSeconds)
  const running = left > 0

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  return { left, restart: setLeft }
}
