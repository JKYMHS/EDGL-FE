import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { tripLengthLabel } from '@/shared/lib/date'
import { Button, Chip, Modal, SearchMark, TextField } from '@/shared/ui'

const NAME_MAX = 30

/** 새 여행 만들기 (시안 E-1) · FUNC-004-01. 첫 일정안 "기본 코스"를 함께 만들고 확정한다 */
export function NewTripModal({
  open,
  onOpenChange,
  regions,
  companions,
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  regions: string[]
  companions: string[]
  onCreate: () => void
}) {
  const [name, setName] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [region, setRegion] = useState(regions[0])
  const [companion, setCompanion] = useState<string>()
  const rangeOk = Boolean(start && end && end >= start)
  const ok = name.trim().length > 0 && rangeOk && Boolean(companion)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="새 여행 만들기"
      description={
        <span className="text-sm">첫 일정안 &quot;기본 코스&quot;를 함께 만들고 확정해 둬요.</span>
      }
      className="w-[600px] gap-5 rounded-[20px]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label htmlFor="trip-name" className="text-sm font-semibold">
            여행 이름
          </label>
          <span className="font-mono text-xs text-muted">
            {name.length}/{NAME_MAX}
          </span>
        </div>
        <TextField
          id="trip-name"
          value={name}
          maxLength={NAME_MAX}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 부산 해운대 2박 3일"
        />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">기간</legend>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <TextField
            type="date"
            aria-label="가는 날"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="font-mono"
          />
          <span className="text-muted">–</span>
          <TextField
            type="date"
            aria-label="오는 날"
            value={end}
            min={start || undefined}
            onChange={(e) => setEnd(e.target.value)}
            className="font-mono"
          />
        </div>
        {rangeOk && <span className="text-[13px] text-sub">{tripLengthLabel(start, end)}</span>}
      </fieldset>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">지역</span>
          <span className="relative">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-12 w-full appearance-none rounded-[10px] border border-line px-3.5 text-[15px] outline-none focus:border-sky"
            >
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sub"
            />
          </span>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            출발지 <span className="font-medium text-muted">선택</span>
          </span>
          <span className="flex h-12 items-center gap-2.5 rounded-[10px] border border-line px-3.5 focus-within:border-sky">
            <SearchMark />
            <input
              placeholder="역, 공항, 주소"
              className="min-w-0 flex-1 text-[15px] outline-none placeholder:text-muted"
            />
          </span>
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">동행</span>
        <div className="flex flex-wrap gap-2">
          {companions.map((c) => (
            <Chip
              key={c}
              selected={companion === c}
              onClick={() => setCompanion(c)}
              className="px-3.5 py-2 text-sm"
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="secondary"
          size="lg"
          className="h-[46px] px-[18px]"
          onClick={() => onOpenChange(false)}
        >
          취소
        </Button>
        <Button size="lg" className="h-[46px] px-[22px]" disabled={!ok} onClick={onCreate}>
          만들기
        </Button>
      </div>
    </Modal>
  )
}
