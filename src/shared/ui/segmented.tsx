import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type SegmentedProps<T extends string> = {
  items: { value: T; label: ReactNode }[]
  value: T
  onChange: (value: T) => void
  label: string
  className?: string
}

/** 회색 바탕 안에서 하나를 고르는 버튼 묶음 (07-2 시작 시간, 13 페이스) */
export function Segmented<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex rounded-xl bg-field p-1', className)}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'h-9 rounded-[9px] px-[18px] text-sm font-semibold whitespace-nowrap transition-colors',
              active
                ? 'bg-white text-ink shadow-[0_1px_3px_rgba(30,36,32,.12)]'
                : 'text-sub hover:text-ink',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
