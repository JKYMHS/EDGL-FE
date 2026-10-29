import { OptionCard, RadioMark, Toggle } from '@/shared/ui'
import type { CompanionOption } from '../model/types'

/** 07-4 동행 + 실내 위주로 짜기 */
export function CompanionStep({
  options,
  companionId,
  indoor,
  onCompanionChange,
  onIndoorChange,
}: {
  options: CompanionOption[]
  companionId: string
  indoor: boolean
  onCompanionChange: (id: string) => void
  onIndoorChange: (indoor: boolean) => void
}) {
  return (
    <>
      <div role="radiogroup" aria-label="동행" className="flex flex-col gap-2.5">
        {options.map((o) => (
          <OptionCard
            key={o.id}
            role="radio"
            aria-checked={o.id === companionId}
            selected={o.id === companionId}
            onClick={() => onCompanionChange(o.id)}
            className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-3.5 p-[18px]"
          >
            <RadioMark checked={o.id === companionId} />
            <span className="flex flex-col gap-[3px]">
              <span className="text-[17px] font-semibold">{o.name}</span>
              <span className="text-sm text-sub">{o.description}</span>
            </span>
          </OptionCard>
        ))}
      </div>
      <label className="mt-4 grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl bg-[#F8FAFB] px-[18px] py-4 shadow-[inset_0_0_0_1px_var(--color-line)]">
        <span className="flex flex-col gap-[3px]">
          <span className="text-[15px] font-semibold">실내 위주로 짜기</span>
          <span className="text-[13px] text-sub">
            비 오는 날이나 더운 날에 좋아요. 실외 장소를 빼지는 않아요
          </span>
        </span>
        <Toggle checked={indoor} onCheckedChange={onIndoorChange} label="실내 위주로 짜기" />
      </label>
    </>
  )
}
