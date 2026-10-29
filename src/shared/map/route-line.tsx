import type { MapPoint } from './map-canvas'

/** 이동 수단 선: 도보 점선, 대중교통 실선, 택시 굵은 실선, 임시 직선 회색 점선 (디자인 00) */
export type RouteMode = 'walk' | 'transit' | 'taxi' | 'temp' | 'progress'

const STYLE: Record<RouteMode, { width: number; dash?: string; cap?: 'round' }> = {
  walk: { width: 3, dash: '1 6', cap: 'round' },
  transit: { width: 3.5 },
  taxi: { width: 7, cap: 'round' },
  temp: { width: 2.5, dash: '8 6' },
  progress: { width: 2.5, dash: '6 6' },
}

/** 지도 좌표(0~100) 위에 경로 선을 그린다. MapCanvas의 svg 슬롯 안에서 쓴다. */
export function RouteLine({
  points,
  mode,
  color,
  opacity,
}: {
  points: MapPoint[]
  mode: RouteMode
  color: string
  opacity?: number
}) {
  const s = STYLE[mode]
  return (
    <polyline
      points={points.map((p) => `${p.x},${p.y}`).join(' ')}
      stroke={mode === 'temp' ? '#8A918B' : color}
      strokeWidth={s.width}
      strokeDasharray={s.dash}
      strokeLinecap={s.cap}
      strokeLinejoin="round"
      opacity={opacity}
      fill="none"
      vectorEffect="non-scaling-stroke"
    />
  )
}

/** 경로 범례 (도보·대중교통·택시) */
export function RouteLegend({ color = '#1E2420' }: { color?: string }) {
  return (
    <div className="flex flex-col gap-2 text-xs text-sub">
      <span className="flex items-center gap-2">
        <span className="w-7 border-t-[3px] border-dotted" style={{ borderColor: color }} />
        도보
      </span>
      <span className="flex items-center gap-2">
        <span className="h-1 w-7" style={{ background: color }} />
        대중교통
      </span>
      <span className="flex items-center gap-2">
        <span className="h-[7px] w-7 rounded" style={{ background: color }} />
        택시
      </span>
    </div>
  )
}
