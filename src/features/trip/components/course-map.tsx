import type { ReactNode } from 'react'
import { dayColor } from '@/shared/config/day-colors'
import { MapCanvas, NumberMarker, RouteLine, type MapPoint, type RouteMode } from '@/shared/map'

type DayRoute = {
  day: number
  points: MapPoint[]
  /** 구간별 이동 수단. 없으면 모두 실선 */
  modes?: RouteMode[]
}

/** 코스 지도: 일차 색 번호 마커와 이동 수단 선. 보고 있지 않은 일차는 흐리게 (디자인 09, 11-1, 11-2) */
export function CourseMap({
  routes,
  activeDay,
  focus,
  dimOthers = true,
  children,
}: {
  routes: DayRoute[]
  activeDay?: number
  /** 강조할 마커 (일차, 번호) */
  focus?: { day: number; n: number }
  dimOthers?: boolean
  children?: ReactNode
}) {
  const faded = (day: number) => dimOthers && activeDay !== undefined && day !== activeDay
  return (
    <MapCanvas
      svg={routes.map((r) =>
        r.points
          .slice(1)
          .map((p, i) => (
            <RouteLine
              key={`${r.day}-${i}`}
              points={[r.points[i], p]}
              mode={r.modes?.[i] ?? 'transit'}
              color={dayColor(r.day)}
              opacity={faded(r.day) ? 0.35 : undefined}
            />
          )),
      )}
    >
      {routes.map((r) =>
        r.points.map((p, i) => {
          const focused = focus?.day === r.day && focus.n === i + 1
          return (
            <NumberMarker
              key={`${r.day}-${i}`}
              point={p}
              n={i + 1}
              color={dayColor(r.day)}
              size={focused ? 36 : faded(r.day) ? 26 : 30}
              ring={focused ? 'rgba(226,85,45,.22)' : undefined}
              opacity={faded(r.day) ? 0.45 : undefined}
            />
          )
        }),
      )}
      {children}
    </MapCanvas>
  )
}
