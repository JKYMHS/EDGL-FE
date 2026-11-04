import { useState } from 'react'
import { tripLengthLabel } from '@/shared/lib/date'
import { Button, Chip, Modal, TextField } from '@/shared/ui'

const NAME_MAX = 30

export type TripInfo = { name: string; start: string; end: string; companion: string }

/** 여행 상세 "여행 정보 수정" · FUNC-004-04. 이름·기간·동행 */
export function TripInfoModal({
  open,
  onOpenChange,
  initial,
  companions,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial: TripInfo
  companions: string[]
  onSave: (info: TripInfo) => void
}) {
  const [info, setInfo] = useState(initial)
  const set = (patch: Partial<TripInfo>) => setInfo((v) => ({ ...v, ...patch }))
  const rangeOk = Boolean(info.start && info.end && info.end >= info.start)
  const ok = info.name.trim().length > 0 && rangeOk

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="여행 정보 수정"
      description={
        <span className="text-sm">기간을 줄이면 빠지는 날의 장소는 마지막 날로 옮겨요.</span>
      }
      className="w-[560px] gap-5 rounded-[20px]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label htmlFor="trip-info-name" className="text-sm font-semibold">
            여행 이름
          </label>
          <span className="font-mono text-xs text-muted">
            {info.name.length}/{NAME_MAX}
          </span>
        </div>
        <TextField
          id="trip-info-name"
          value={info.name}
          maxLength={NAME_MAX}
          onChange={(e) => set({ name: e.target.value })}
        />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">기간</legend>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <TextField
            type="date"
            aria-label="가는 날"
            value={info.start}
            onChange={(e) => set({ start: e.target.value })}
            className="font-mono"
          />
          <span className="text-muted">–</span>
          <TextField
            type="date"
            aria-label="오는 날"
            value={info.end}
            min={info.start || undefined}
            onChange={(e) => set({ end: e.target.value })}
            className="font-mono"
          />
        </div>
        {rangeOk && (
          <span className="text-[13px] text-sub">{tripLengthLabel(info.start, info.end)}</span>
        )}
      </fieldset>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">동행</span>
        <div className="flex flex-wrap gap-2">
          {companions.map((c) => (
            <Chip
              key={c}
              selected={info.companion === c}
              onClick={() => set({ companion: c })}
              className="px-3.5 py-2 text-sm"
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button disabled={!ok} onClick={() => onSave({ ...info, name: info.name.trim() })}>
          저장
        </Button>
      </div>
    </Modal>
  )
}
