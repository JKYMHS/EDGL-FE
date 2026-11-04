import { useEffect, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** 화면 아래 가운데 검은 알림. action이 있으면 오른쪽에 하늘색 버튼 (시안 A-3, E-2) */
export function Toast({
  children,
  action,
  onClose,
  duration = 4000,
  className,
}: {
  children: ReactNode
  action?: ReactNode
  onClose?: () => void
  duration?: number
  className?: string
}) {
  useEffect(() => {
    if (!onClose) return
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      role="status"
      className={cn(
        'fixed bottom-10 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink py-3 pr-3 pl-5 text-sm whitespace-nowrap text-white shadow-[0_8px_24px_rgba(30,36,32,.25)]',
        !action && 'pr-5',
        className,
      )}
    >
      {children}
      {action}
    </div>
  )
}
