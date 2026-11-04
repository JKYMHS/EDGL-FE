import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { StartMarker } from '@/shared/map'
import { Chip, SearchMark } from '@/shared/ui'
import type { DepartureOption } from '../model/types'

/** 07-3 출발지: 검색 결과 · 현재 위치 · 최근 출발지 (FUNC-003-01) */
export function DepartureStep({
  query,
  results,
  recent,
  selectedId,
  onQueryChange,
  onSelect,
}: {
  query: string
  results: DepartureOption[]
  recent: string[]
  selectedId: string
  onQueryChange: (q: string) => void
  onSelect: (id: string) => void
}) {
  return (
    <>
      <label className="flex h-14 items-center gap-3 rounded-xl border-[1.5px] border-sky px-4 shadow-[0_0_0_4px_var(--color-sky-soft)]">
        <SearchMark active />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="출발지 검색"
          placeholder="역, 공항, 주소로 찾기"
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
        />
        {query && (
          <button
            type="button"
            aria-label="지우기"
            onClick={() => onQueryChange('')}
            className="text-muted"
          >
            <X size={14} />
          </button>
        )}
      </label>
      <div role="listbox" aria-label="출발지 후보" className="flex flex-col">
        <button
          type="button"
          className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-3 border-b border-surface px-3 py-3.5 text-left"
        >
          <span className="grid size-7 place-items-center rounded-full bg-field text-[13px] text-sky-text">
            ◎
          </span>
          <span className="text-[15px] font-semibold text-sky-text">현재 위치 사용하기</span>
        </button>
        {results.map((r) => {
          const selected = r.id === selectedId
          return (
            <button
              key={r.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(r.id)}
              className={cn(
                'grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3.5 text-left',
                selected
                  ? 'rounded-[10px] bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                  : 'border-b border-surface hover:bg-[#F8FAFB]',
              )}
            >
              {selected ? (
                <StartMarker className="text-[9px]" />
              ) : (
                <span className="size-7 rounded-full bg-field" />
              )}
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold">{r.name}</span>
                <span className="text-[13px] text-sub">{r.address}</span>
              </span>
              {selected && <span className="text-xs font-semibold text-sky-text">선택됨</span>}
            </button>
          )
        })}
      </div>
      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-bold text-sub">최근 출발지</span>
        <div className="flex gap-2">
          {recent.map((name) => (
            <Chip key={name} onClick={() => onQueryChange(name)} className="px-3.5 py-2 text-sm">
              {name}
            </Chip>
          ))}
        </div>
      </div>
    </>
  )
}
