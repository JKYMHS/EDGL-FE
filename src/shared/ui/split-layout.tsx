import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** 표 + 지도: 왼쪽 680px 패널, 오른쪽 지도 (PRD 6.1) */
export function SplitLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1">
      {left}
      <div className="relative min-w-0 flex-1 overflow-hidden">{right}</div>
    </div>
  )
}

/** 왼쪽 패널 틀. 트레이를 absolute로 띄울 수 있도록 relative */
export function LeftPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn('relative flex w-[680px] shrink-0 flex-col border-r border-line', className)}
    >
      {children}
    </section>
  )
}
