import { cn } from '@/shared/lib/cn'

/** 라디오 동그라미 (모양만). 선택 로직은 감싸는 버튼이 맡는다. */
export function RadioMark({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'box-border inline-block size-5 shrink-0 rounded-full bg-white transition-all',
        checked ? 'border-[6px] border-sky' : 'border-[1.5px] border-line-strong',
        className,
      )}
    />
  )
}
