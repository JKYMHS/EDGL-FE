/** "HH:mm"을 시 단위 소수로 바꾼다. "15:20" → 15.333… */
export function toHours(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h + m / 60
}
