import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Checkbox, SearchMark, WarningText } from '@/shared/ui'
import type { MustVisitPlace } from '../model/types'

/** 07-5 꼭 포함할 장소 (최대 5곳) */
export function MustVisitStep({
  candidates,
  selectedIds,
  limit,
  onChange,
}: {
  candidates: MustVisitPlace[]
  selectedIds: string[]
  limit: number
  onChange: (ids: string[]) => void
}) {
  const picked = selectedIds.flatMap((id) => candidates.find((c) => c.id === id) ?? [])
  const rest = candidates.filter((c) => !selectedIds.includes(c.id))
  const full = selectedIds.length >= limit

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-bold">
            담은 곳{' '}
            <span className="font-mono text-[13px] font-semibold text-sky-text">
              {picked.length}/{limit}
            </span>
          </span>
          <span className="text-[13px] text-sub">탐색에서 비교하던 곳을 가져왔어요</span>
        </div>
        {picked.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              'grid grid-cols-[28px_minmax(0,1fr)_120px_28px] items-center gap-3 rounded-[10px] px-3 py-2.5',
              p.warning
                ? 'bg-warn-soft shadow-[inset_0_0_0_1px_#E3C68A]'
                : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
            )}
          >
            <span className="grid size-[22px] place-items-center rounded-full bg-sky font-mono text-[11px] font-semibold text-white">
              {i + 1}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">{p.name}</span>
              {p.warning ? (
                <WarningText>{p.warning}</WarningText>
              ) : (
                <span className="text-xs text-sub">{p.meta}</span>
              )}
            </span>
            <span className="font-mono text-xs font-medium text-sub">{p.period}</span>
            <button
              type="button"
              aria-label={`${p.name} 빼기`}
              onClick={() => onChange(selectedIds.filter((id) => id !== p.id))}
              className="grid place-items-center text-muted hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        <label className="flex h-12 items-center gap-2.5 rounded-xl border border-line px-4 focus-within:border-sky">
          <SearchMark />
          <input
            aria-label="장소 이름으로 추가"
            placeholder="장소 이름으로 추가"
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </label>
        <span className="pt-1 text-[13px] font-bold text-sub">찜한 곳에서 고르기</span>
        {rest.map((p) => (
          <label
            key={p.id}
            className="grid cursor-pointer grid-cols-[28px_minmax(0,1fr)_120px] items-center gap-3 px-3 py-2"
          >
            <Checkbox
              size="sm"
              checked={false}
              onCheckedChange={() => !full && onChange([...selectedIds, p.id])}
              label={`${p.name} 담기`}
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">{p.name}</span>
              <span className="text-xs text-sub">{p.meta}</span>
            </span>
            <span className="font-mono text-xs font-medium text-sub">{p.period}</span>
          </label>
        ))}
      </div>
    </>
  )
}
