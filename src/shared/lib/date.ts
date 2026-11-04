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

function fromUtc(ms: number) {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

/** "YYYY-MM-DD"에 n일을 더한다 */
export function addDays(ymd: string, n: number) {
  return fromUtc(toUtc(ymd) + n * DAY_MS)
}

/** 요일 (월=0 … 일=6) */
export function weekdayMonFirst(ymd: string) {
  return (new Date(toUtc(ymd)).getUTCDay() + 6) % 7
}

/** 그 달의 1일 "YYYY-MM-01" */
export function firstOfMonth(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}-01`
}

/** 그 달의 마지막 날 */
export function lastOfMonth(year: number, month: number) {
  return fromUtc(Date.UTC(year, month, 0))
}

/** 달을 n개월 옮긴다. { year, month } (month 1~12) */
export function shiftMonth(year: number, month: number, n: number) {
  const index = year * 12 + (month - 1) + n
  return { year: Math.floor(index / 12), month: (index % 12) + 1 }
}
