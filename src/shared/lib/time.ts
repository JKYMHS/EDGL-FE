/** "HH:mm"을 시 단위 소수로 바꾼다. "15:20" → 15.333… */
export function toHours(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h + m / 60
}

/** "HH:mm" → 자정부터 분. "10:30" → 630 */
export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** 자정부터 분 → "HH:mm". 하루를 넘으면 24시 이후로 그대로 쓴다 */
export function fromMinutes(total: number) {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** 분 → "1시간 30분", "45분", "2시간" */
export function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분`
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`
}

/** 초 → "04:32" */
export function formatClock(seconds: number) {
  const s = Math.max(0, seconds)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** "04:32" → 272초 */
export function parseClock(clock: string) {
  const [m, s] = clock.split(':').map(Number)
  return m * 60 + s
}
