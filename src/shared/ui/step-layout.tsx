import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { StepTray } from './tray'

/**
 * 단계형 화면 틀 (PRD 6.1): 단계 헤더, 가운데 760px 본문, 하단 트레이.
 * 본문만 스크롤하고 트레이는 화면 아래에 고정한다.
 */
export function StepLayout({
  header,
  tray,
  trayClassName,
  bodyClassName,
  children,
}: {
  header: ReactNode
  tray?: ReactNode
  trayClassName?: string
  bodyClassName?: string
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-h-[720px] flex-col">
      {header}
      <div className="relative min-h-0 flex-1">
        <main className="absolute inset-0 overflow-y-auto">
          <div className={cn('mx-auto flex w-[760px] flex-col gap-7 pt-16 pb-36', bodyClassName)}>
            {children}
          </div>
        </main>
        {tray && <StepTray className={trayClassName}>{tray}</StepTray>}
      </div>
    </div>
  )
}
