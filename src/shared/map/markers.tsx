import { cn } from '@/shared/lib/cn'
import { MapPin, type MapPoint } from './map-canvas'

export type MarkerState = 'default' | 'hover' | 'selected'

const PIN_SIZE: Record<MarkerState, number> = { default: 30, hover: 34, selected: 38 }

/** 탐색 마커: 기본(검정) · 강조 · 선택(하늘색, 더 큼) (디자인 00, 04) */
export function ExploreMarker({
  point,
  n,
  state = 'default',
  dimmed = false,
  label,
  onClick,
  onHover,
}: {
  point: MapPoint
  n: number
  state?: MarkerState
  dimmed?: boolean
  label: string
  onClick?: () => void
  onHover?: (hovering: boolean) => void
}) {
  const size = PIN_SIZE[state]
  const active = state !== 'default'
  return (
    <MapPin point={point} anchor="bottom" z={state === 'selected' ? 10 : state === 'hover' ? 8 : 1}>
      <button
        type="button"
        aria-label={`${n}. ${label}`}
        onClick={onClick}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
        className={cn(
          'flex flex-col items-center transition-transform hover:-translate-y-[3px]',
          dimmed && 'opacity-55',
        )}
      >
        <span
          className={cn(
            'grid -rotate-45 place-items-center rounded-[50%_50%_50%_0] border-2 border-white shadow-[0_3px_8px_rgba(30,36,32,.28)]',
            active ? 'bg-sky' : 'bg-ink',
          )}
          style={{ width: size, height: size }}
        >
          <span className="rotate-45 font-mono text-xs font-bold text-white">{n}</span>
        </span>
        <span className="mt-[3px] h-1 w-2.5 rounded-[50%] bg-[rgba(30,36,32,.25)]" />
      </button>
    </MapPin>
  )
}

/** 번호 동그라미 마커: 코스(일차 색), 함께 가기 좋은 곳, 로그인 그림 */
export function NumberMarker({
  point,
  n,
  color,
  size = 28,
  ring,
  opacity,
  className,
}: {
  point: MapPoint
  n: number | string
  color: string
  size?: number
  /** 선택 강조 고리 색 (예: rgba(226,85,45,.22)) */
  ring?: string
  opacity?: number
  className?: string
}) {
  return (
    <MapPin point={point} z={ring ? 5 : 1}>
      <span
        className={cn(
          'grid place-items-center rounded-full border-2 border-white font-mono text-xs font-semibold text-white',
          className,
        )}
        style={{
          width: size,
          height: size,
          background: color,
          opacity,
          boxShadow: ring
            ? `0 0 0 6px ${ring}, 0 2px 8px rgba(30,36,32,.25)`
            : '0 2px 8px rgba(30,36,32,.25)',
        }}
      >
        {n}
      </span>
    </MapPin>
  )
}

/** 출발 마커 */
export function StartMarker({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid size-7 place-items-center rounded-[7px] bg-ink text-[11px] font-bold text-white',
        className,
      )}
    >
      출발
    </span>
  )
}
