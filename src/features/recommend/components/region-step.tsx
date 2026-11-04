import { Check } from 'lucide-react'
import { Chip, OptionCard, RadioMark, SearchMark } from '@/shared/ui'
import type { RegionOption } from '../model/types'

/** 07-1 지역: 시·도 하나 + 구·군 여러 개 (선택) */
export function RegionStep({
  regions,
  districts,
  moreDistrictCount,
  regionId,
  selectedDistricts,
  onRegionChange,
  onDistrictsChange,
}: {
  regions: RegionOption[]
  districts: string[]
  moreDistrictCount: number
  regionId: string
  selectedDistricts: string[]
  onRegionChange: (id: string) => void
  onDistrictsChange: (districts: string[]) => void
}) {
  const region = regions.find((r) => r.id === regionId)
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
          placeholder="지역 이름으로 찾기"
          aria-label="지역 이름으로 찾기"
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
        />
      </label>
      <div role="radiogroup" aria-label="시·도" className="grid grid-cols-3 gap-2.5">
        {regions.map((r) => (
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
            {districts.map((d) => {
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
            <Chip className="px-3.5 py-2 text-sm text-sub">+{moreDistrictCount}</Chip>
          </div>
        </div>
      )}
    </>
  )
}
