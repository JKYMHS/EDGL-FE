import { cn } from '@/shared/lib/cn'

export type TabItem<T extends string> = { value: T; label: string; count?: number }

type TabsProps<T extends string> = {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  className?: string
}

/** 밑줄 탭 (축제·관광지 등). 개수는 숫자 글꼴로 붙인다. */
export function Tabs<T extends string>({ items, value, onChange, label, className }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex gap-7', className)}>
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              '-mb-px border-b-2 py-2.5 text-base font-bold transition-colors',
              active ? 'border-sky text-ink' : 'border-transparent text-muted hover:text-sub',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <>
                {' '}
                <span className="font-mono text-xs font-semibold">{item.count}</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
