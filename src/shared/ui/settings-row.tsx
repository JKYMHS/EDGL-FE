import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** 마이페이지 설정 행: 제목·설명(200px) | 내용 | 조작 (디자인 13, 시안 C-1) */
export function SettingsRow({
  title,
  hint,
  children,
  aside,
  className,
}: {
  title: string
  hint?: string
  children?: ReactNode
  aside?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-[200px_minmax(0,1fr)_auto] items-center gap-6 border-t border-surface py-5',
        className,
      )}
    >
      <div className="flex flex-col gap-[3px]">
        <span className="text-[15px] font-semibold">{title}</span>
        {hint && <span className="text-[13px] text-sub">{hint}</span>}
      </div>
      <div className="min-w-0">{children}</div>
      <div>{aside}</div>
    </div>
  )
}
