import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** 하단 플로팅 트레이: 흰 바탕 + 그림자, 선택이 모이는 곳, 화면당 하나 (디자인 00) */
export function Tray({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3.5 rounded-2xl border border-line bg-white p-2.5 text-ink shadow-tray',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** 왼쪽 패널 아래에 붙는 트레이 위치 */
export function PanelTray({ children, className }: { children: ReactNode; className?: string }) {
  return <Tray className={cn('absolute right-4 bottom-4 left-4 z-10', className)}>{children}</Tray>
}

/** 단계형 화면 가운데 아래에 붙는 트레이 위치 (폭 760) */
export function StepTray({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Tray className={cn('absolute bottom-10 left-1/2 z-10 w-[760px] -translate-x-1/2', className)}>
      {children}
    </Tray>
  )
}
