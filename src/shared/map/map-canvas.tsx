import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** 지도 위 좌표. 지도 영역 기준 백분율(0~100) */
export type MapPoint = { x: number; y: number }

const RIVERS = {
  /** 탐색·찜·여행 화면의 강 */
  middle: 'M0 63.3 C 26.3 58.8, 50 70.1, 100 61.1',
  /** 상세 화면의 강 (조금 위, 얇게) */
  high: 'M0 53.2 C 26.3 49.8, 55.3 56.6, 100 50.9',
  /** 로그인 화면의 강 */
  low: 'M0 64.6 C 26.3 60.4, 50 70.8, 100 62.5',
} as const

type MapCanvasProps = {
  river?: keyof typeof RIVERS | 'none'
  /** 세로로 지나가는 도로 (탐색 화면) */
  road?: boolean
  /** 지도 좌표(0~100) 위에 그리는 SVG 요소: 경로 선, 반경 원 */
  svg?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * 디자인대로 그린 정적인 지도 바탕. 실제 카카오맵은 기능 개발 때 이 자리에 붙인다 (TRD 9장).
 * 마커는 children으로 넣고 x·y 백분율로 놓는다.
 */
export function MapCanvas({
  river = 'middle',
  road = false,
  svg,
  children,
  className,
}: MapCanvasProps) {
  return (
    <div
      role="img"
      aria-label="지도"
      className={cn(
        'absolute inset-0 overflow-hidden bg-[#EEF2F4]',
        '[background-image:repeating-radial-gradient(circle_at_45%_50%,transparent_0_40px,#E0E6EA_40px_41px),repeating-radial-gradient(circle_at_85%_75%,transparent_0_30px,#E5EAED_30px_31px)]',
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {river !== 'none' && (
          <path
            d={RIVERS[river]}
            stroke="#CFE6F5"
            strokeWidth={river === 'high' ? 18 : 22}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {road && (
          <path
            d="M34.2 0 C 36.8 33.9, 47.4 67.9, 43.4 100"
            stroke="#DCE2E6"
            strokeWidth={6}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {svg}
      </svg>
      {children}
    </div>
  )
}

/** 지도 위 좌표에 요소를 놓는다. anchor가 bottom이면 아래 끝이 좌표에 닿는다. */
export function MapPin({
  point,
  anchor = 'center',
  z,
  className,
  children,
}: {
  point: MapPoint
  anchor?: 'center' | 'bottom'
  z?: number
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'absolute',
        anchor === 'center'
          ? '-translate-x-1/2 -translate-y-1/2'
          : '-translate-x-1/2 -translate-y-full',
        className,
      )}
      style={{ left: `${point.x}%`, top: `${point.y}%`, zIndex: z }}
    >
      {children}
    </div>
  )
}

/** 지도 위에 떠 있는 흰 상자 (안내, 범례, 비교 요약) */
export function MapPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'absolute z-20 rounded-xl bg-white shadow-[0_2px_8px_rgba(30,36,32,.12)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** 확대·축소 버튼 (모양만) */
export function ZoomControl() {
  return (
    <div className="absolute right-4 bottom-4 z-20 flex flex-col rounded-[10px] bg-white text-lg font-semibold shadow-[0_2px_8px_rgba(30,36,32,.12)]">
      <button
        type="button"
        aria-label="확대"
        className="grid size-10 place-items-center border-b border-line"
      >
        +
      </button>
      <button type="button" aria-label="축소" className="grid size-10 place-items-center">
        −
      </button>
    </div>
  )
}
