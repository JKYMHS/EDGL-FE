import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean
  /** 동행 선택처럼 검은 칩 */
  tone?: 'default' | 'dark'
}

/** 필터·선택 칩 (디자인 00 "칩") */
export function Chip({ selected = false, tone = 'default', className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-[13px] py-[7px] text-[13px] font-semibold whitespace-nowrap transition-colors',
        tone === 'dark'
          ? 'border-ink bg-ink text-white'
          : selected
            ? 'border-sky-line bg-sky-soft text-sky-text'
            : 'border-line bg-white hover:bg-[#F5F8FA]',
        className,
      )}
      {...props}
    />
  )
}

/** 트레이·추천 검색어에 쓰는 회색 알약. onRemove가 있으면 × 버튼을 붙인다. */
export function Pill({
  children,
  onRemove,
  className,
}: {
  children: ReactNode
  onRemove?: () => void
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-field px-3 py-[5px] text-[13px] font-semibold whitespace-nowrap',
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${String(children)} 빼기`}
          className="-mr-1 p-0.5"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </span>
  )
}
