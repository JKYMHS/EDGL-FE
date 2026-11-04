import { cn } from '@/shared/lib/cn'
import type { PlanStatus } from '../model/types'

/** 일정안 상태: 확정(하늘색 채움) · 초안(테두리) */
export function PlanStatusChip({ status, className }: { status: PlanStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex justify-self-start rounded-full border-[1.5px] px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        status === '확정' ? 'border-sky bg-sky text-white' : 'border-ink bg-white text-ink',
        className,
      )}
    >
      {status}
    </span>
  )
}
