/** 일차 색 1~4 (TRD 10장). 5일차부터는 다시 1일차 색을 쓴다. */
export const DAY_COLORS = ['#E2552D', '#2C6BD8', '#2E9A5A', '#8A4FD1'] as const

export function dayColor(day: number) {
  return DAY_COLORS[(day - 1) % DAY_COLORS.length]
}
