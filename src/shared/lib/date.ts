/**
 * 날짜 문자열("YYYY-MM-DD") 계산. 시간대와 상관없는 달력 날짜만 다루므로
 * UTC 자정 기준으로 계산해 KST에서도 하루가 밀리지 않는다 (TRD 5.1).
 */
function toUtc(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

const DAY_MS = 24 * 60 * 60 * 1000

/** b - a 일수 */
export function daysBetween(a: string, b: string) {
  return Math.round((toUtc(b) - toUtc(a)) / DAY_MS)
}

/** "1박 2일", 당일이면 "당일" */
export function tripLengthLabel(start: string, end: string) {
  const nights = daysBetween(start, end)
  return nights <= 0 ? '당일' : `${nights}박 ${nights + 1}일`
}

/** "10.24" */
export function formatMonthDay(ymd: string) {
  const [, m, d] = ymd.split('-')
  return `${m}.${d}`
}

/** 같은 달이면 "10.24 – 25", 다르면 "10.31 – 11.01" */
export function formatShortRange(start: string, end: string) {
  if (start === end) return formatMonthDay(start)
  const [, sm] = start.split('-')
  const [, em, ed] = end.split('-')
  return `${formatMonthDay(start)} – ${sm === em ? ed : formatMonthDay(end)}`
}
