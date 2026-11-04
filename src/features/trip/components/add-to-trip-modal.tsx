import { ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button, Modal, RadioMark, Segmented, WarningText } from '@/shared/ui'

type TargetTrip = {
  id: string
  title: string
  period: string
  planCount: number
  /** 장소(축제) 기간과 여행 날짜가 겹치는지 */
  overlaps: boolean
  plans: { id: string; name: string; confirmed: boolean }[]
  days: string[]
}

/** 기존 여행에 장소 추가: 여행 → 일정안(기본 확정안) → 일차 (시안 E-2) · FUNC-004-06 */
export function AddToTripModal({
  open,
  onOpenChange,
  placeName,
  placePeriod,
  trips,
  onNewTrip,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  placeName: string
  placePeriod: string
  trips: TargetTrip[]
  onNewTrip: () => void
  onAdd: (tripTitle: string) => void
}) {
  const [tripId, setTripId] = useState(trips.find((t) => t.overlaps)?.id ?? trips[0]?.id)
  const trip = trips.find((t) => t.id === tripId)
  const [planId, setPlanId] = useState(trip?.plans.find((p) => p.confirmed)?.id)
  const [day, setDay] = useState(trip?.days[0])

  const pickTrip = (t: TargetTrip) => {
    setTripId(t.id)
    setPlanId(t.plans.find((p) => p.confirmed)?.id ?? t.plans[0]?.id)
    setDay(t.days[0])
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="어느 여행에 담을까요?"
      description={
        <span className="text-sm">
          {placeName} · <span className="font-mono">{placePeriod}</span>
        </span>
      }
      className="w-[600px] gap-[18px] rounded-[20px]"
    >
      <div role="radiogroup" aria-label="여행" className="flex flex-col gap-2">
        {trips.map((t) => {
          const on = t.id === tripId
          return (
            <div
              key={t.id}
              className={cn(
                'flex flex-col gap-3 rounded-xl px-3.5 py-3',
                on
                  ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                  : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
              )}
            >
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => pickTrip(t)}
                className="flex items-center gap-3 text-left"
              >
                <RadioMark checked={on} />
                <span className="flex flex-1 flex-col">
                  <span className="text-[15px] font-semibold">{t.title}</span>
                  <span className="font-mono text-xs text-sub">
                    {t.period} · 일정안 {t.planCount}
                  </span>
                </span>
                {t.overlaps ? (
                  <span className="text-[11px] font-semibold text-sky-text">
                    축제 기간과 겹쳐요
                  </span>
                ) : (
                  <WarningText className="text-[11px]">축제 기간이 아니에요</WarningText>
                )}
              </button>
              {on && (
                <div className="ml-8 grid grid-cols-[70px_1fr] items-center gap-2.5 text-[13px]">
                  <span className="font-semibold text-sub">일정안</span>
                  <span className="relative">
                    <select
                      aria-label="일정안"
                      value={planId}
                      onChange={(e) => setPlanId(e.target.value)}
                      className="h-10 w-full appearance-none rounded-[10px] border border-line bg-white px-3 text-sm outline-none focus:border-sky"
                    >
                      {t.plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                          {p.confirmed ? ' (확정)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sub"
                    />
                  </span>
                  <span className="font-semibold text-sub">일차</span>
                  <Segmented
                    label="일차"
                    value={day ?? t.days[0]}
                    onChange={setDay}
                    className="w-max rounded-[10px] bg-white"
                    items={t.days.map((d) => ({ value: d, label: d }))}
                  />
                </div>
              )}
            </div>
          )
        })}
        <button
          type="button"
          onClick={onNewTrip}
          className="flex items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-line-strong px-3.5 py-3 text-sm font-semibold text-sky-text"
        >
          <Plus size={14} strokeWidth={2.5} />새 여행 만들기
        </button>
      </div>
      <p className="-mt-1.5 text-xs text-muted">
        고른 일차의 마지막 순서에 추가돼요. 순서는 일정 편집에서 바꿀 수 있어요.
      </p>
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          size="lg"
          className="h-[46px] px-[18px]"
          onClick={() => onOpenChange(false)}
        >
          취소
        </Button>
        <Button
          size="lg"
          className="h-[46px] px-[22px]"
          disabled={!trip}
          onClick={() => trip && onAdd(trip.title)}
        >
          담기
        </Button>
      </div>
    </Modal>
  )
}
