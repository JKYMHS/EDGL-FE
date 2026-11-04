import { cn } from '@/shared/lib/cn'

/** 디자인의 검색 표시(작은 동그라미) */
export function SearchMark({
  active = false,
  className,
}: {
  active?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'box-border inline-block size-3.5 shrink-0 rounded-full border-2',
        active ? 'border-sky-text' : 'border-muted',
        className,
      )}
    />
  )
}
