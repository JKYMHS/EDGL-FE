import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

/** 만족도 1~5 (PRD 8.1). 다녀오지 않았으면 끈다 */
export function StarRating({
  value,
  onChange,
  disabled = false,
  label,
}: {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  label: string
}) {
  if (disabled) return <span className="text-xs text-muted">—</span>
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}점`}
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <Star
            size={18}
            strokeWidth={0}
            fill="currentColor"
            className={cn(n <= value ? 'text-[#F2A91C]' : 'text-line-strong')}
          />
        </button>
      ))}
    </div>
  )
}
