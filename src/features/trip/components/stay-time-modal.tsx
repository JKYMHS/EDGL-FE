import { useState } from 'react'
import { durationLabel } from '@/shared/lib/time'
import { Chip, ConfirmDialog } from '@/shared/ui'

const OPTIONS = [30, 60, 90, 120, 180] as const

/** 일정 편집 항목 메뉴 "체류 시간 바꾸기" · FUNC-004-02 */
export function StayTimeModal({
  open,
  onOpenChange,
  placeName,
  current,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  placeName: string
  /** 지금 체류 시간(분) */
  current: number
  onConfirm: (minutes: number) => void
}) {
  const [value, setValue] = useState(current)
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      className="w-[440px]"
      title="체류 시간 바꾸기"
      description={`${placeName}에 머무는 시간을 골라 주세요. 뒤 일정 시각은 "경로 다시 계산"에서 맞춰져요.`}
      confirmLabel="바꾸기"
      onConfirm={() => onConfirm(value)}
    >
      <div role="radiogroup" aria-label="체류 시간" className="flex flex-wrap gap-2">
        {OPTIONS.map((m) => (
          <Chip
            key={m}
            role="radio"
            aria-checked={value === m}
            aria-pressed={undefined}
            selected={value === m}
            onClick={() => setValue(m)}
            className="px-3.5 py-2 text-sm"
          >
            {durationLabel(m)}
          </Chip>
        ))}
      </div>
    </ConfirmDialog>
  )
}
