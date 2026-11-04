import { Check } from 'lucide-react'
import { useState } from 'react'
import { Chip, OptionCard, RadioMark, SearchMark } from '@/shared/ui'
import type { RegionOption } from '../model/types'

/** 07-1 지역: 시·도 하나 + 구·군 여러 개 (선택) */
export function RegionStep({
  regions,
  districts,
  moreDistricts,
  regionId,
  selectedDistricts,
  onRegionChange,
  onDistrictsChange,
}: {
  regions: RegionOption[]
  districts: string[]
  /** "+N"을 누르면 펼치는 나머지 구·군 */
  moreDistricts: string[]
  regionId: string
  selectedDistricts: string[]
  onRegionChange: (id: string) => void
  onDistrictsChange: (districts: string[]) => void
}) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const q = query.trim()
  const region = regions.find((r) => r.id === regionId)
  const allDistricts = [...districts, ...moreDistricts]
  // 검색어가 있으면 시·도와 구·군을 모두 거르고, 구·군은 전부에서 찾는다
  const shownRegions = q ? regions.filter((r) => r.name.includes(q)) : regions
  const shownDistricts = q
    ? allDistricts.filter((d) => d.includes(q))
    : expanded
      ? allDistricts
      : districts
  const toggle = (d: string) =>
    onDistrictsChange(
      selectedDistricts.includes(d)
        ? selectedDistricts.filter((v) => v !== d)
        : [...selectedDistricts, d],
    )

  return (
    <>
      <label className="flex h-[52px] items-center gap-2.5 rounded-xl border border-line px-4 focus-within:border-sky">
        <SearchMark />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="지역 이름으로 찾기"
          aria-label="지역 이름으로 찾기"
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
        />
      </label>
      <div role="radiogroup" aria-label="시·도" className="grid grid-cols-3 gap-2.5">
        {shownRegions.map((r) => (
          <OptionCard
            key={r.id}
            role="radio"
            aria-checked={r.id === regionId}
            selected={r.id === regionId}
            onClick={() => onRegionChange(r.id)}
            className="grid grid-cols-[24px_minmax(0,1fr)] items-center gap-3 p-4"
          >
            <RadioMark checked={r.id === regionId} />
            <span className="flex flex-col gap-0.5">
              <span className="text-base font-semibold">{r.name}</span>
              <span className="font-mono text-xs font-medium text-sub">
                축제 {r.festivals} · 관광지 {r.attractions}
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
      {region && (
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-bold">
              {region.name} 안에서 좁히기{' '}
              <span className="text-[13px] font-medium text-sub">선택</span>
            </span>
            <button
              type="button"
              onClick={() => onDistrictsChange([])}
              className="text-[13px] font-semibold text-sub hover:text-ink"
            >
              전체 해제
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {shownDistricts.map((d) => {
              const on = selectedDistricts.includes(d)
              return (
                <Chip
                  key={d}
                  selected={on}
                  onClick={() => toggle(d)}
                  className="px-3.5 py-2 text-sm"
                >
                  {d}
                  {on && <Check size={13} strokeWidth={3} />}
                </Chip>
              )
            })}
            {!q && moreDistricts.length > 0 && (
              <Chip
                aria-expanded={expanded}
                aria-pressed={undefined}
                aria-label={expanded ? '구·군 접기' : `구·군 ${moreDistricts.length}개 더 보기`}
                onClick={() => setExpanded((v) => !v)}
                className="px-3.5 py-2 text-sm text-sub"
              >
                {expanded ? '접기' : `+${moreDistricts.length}`}
              </Chip>
            )}
            {q && shownDistricts.length === 0 && (
              <span className="py-2 text-sm text-sub">&quot;{q}&quot;에 맞는 구·군이 없어요</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}
