import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type OptionCardProps = ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }

/** 고를 수 있는 카드. 선택되면 하늘색 바탕과 테두리 (03, 07-1, 07-4) */
export function OptionCard({ selected, className, ...props }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'rounded-xl text-left transition-colors',
        selected
          ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
          : 'bg-white shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-[#F8FAFB]',
        className,
      )}
      {...props}
    />
  )
}
