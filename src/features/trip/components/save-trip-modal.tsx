import { useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button, Checkbox, Modal, RadioMark, TextField } from '@/shared/ui'
import type { TripSummary } from '../model/types'

type Target = { type: 'existing'; tripId: string } | { type: 'new' }

/** 추천 결과 저장 위치 선택 (디자인 11-4) · FUNC-004-07, 08 */
export function SaveTripModal({
  open,
  onOpenChange,
  courseLabel,
  trips,
  matchedTripId,
  defaultPlanName,
  confirmedPlanName,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseLabel: string
  trips: TripSummary[]
  /** 날짜가 같은 여행 */
  matchedTripId?: string
  defaultPlanName: string
  confirmedPlanName: string
  onSave: () => void
}) {
  const [target, setTarget] = useState<Target>(
    matchedTripId ? { type: 'existing', tripId: matchedTripId } : { type: 'new' },
  )
  const [makeConfirmed, setMakeConfirmed] = useState(false)
  const existing = target.type === 'existing'

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="어디에 저장할까요?"
      description={<span className="text-sm">{courseLabel}</span>}
      className="w-[600px] gap-[18px] rounded-[20px] p-7"
    >
      <div role="radiogroup" aria-label="저장 위치" className="flex flex-col gap-2.5">
        <div
          className={cn(
            'flex flex-col gap-2.5 rounded-xl px-4 py-3.5',
            existing
              ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
              : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
          )}
        >
          <button
            type="button"
            role="radio"
            aria-checked={existing}
            onClick={() => setTarget({ type: 'existing', tripId: matchedTripId ?? trips[0].id })}
            className="flex items-center gap-3 text-left text-[15px] font-semibold"
          >
            <RadioMark checked={existing} />
            기존 여행에 일정안으로 추가
          </button>
          {existing &&
            trips.map((trip) => {
              const on = target.tripId === trip.id
              return (
                <button
                  key={trip.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setTarget({ type: 'existing', tripId: trip.id })}
                  className={cn(
                    'ml-8 grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left',
                    on && 'bg-white shadow-[inset_0_0_0_1.5px_var(--color-sky)]',
                  )}
                >
                  <RadioMark checked={on} className={cn('size-4', on && 'border-[5px]')} />
                  <span className="flex flex-col gap-px">
                    <span className="text-sm font-semibold">{trip.title}</span>
                    <span className="font-mono text-xs font-medium text-sub">
                      {trip.period} · 일정안 {trip.planCount}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-semibold text-sky-text',
                      trip.id !== matchedTripId && 'invisible',
                    )}
                  >
                    날짜가 같아요
                  </span>
                </button>
              )
            })}
        </div>
        <button
          type="button"
          role="radio"
          aria-checked={!existing}
          onClick={() => setTarget({ type: 'new' })}
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-3.5 text-left',
            !existing
              ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
              : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
          )}
        >
          <RadioMark checked={!existing} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">새 여행으로 만들기</span>
            <span className="text-[13px] text-sub">
              여행 이름·기간·동행이 추천 조건으로 채워져요
            </span>
          </span>
        </button>
      </div>
      <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3">
        <label htmlFor="plan-name" className="text-[13px] font-semibold">
          일정안 이름
        </label>
        <TextField id="plan-name" defaultValue={defaultPlanName} className="[&>div]:h-11" />
      </div>
      {existing && (
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            size="sm"
            checked={makeConfirmed}
            onCheckedChange={setMakeConfirmed}
            label="이 일정안을 확정으로 바꾸기"
          />
          이 일정안을 확정으로 바꾸기{' '}
          <span className="text-xs text-sub">(지금 확정: {confirmedPlanName})</span>
        </label>
      )}
      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="secondary"
          size="lg"
          className="h-[46px] px-[18px]"
          onClick={() => onOpenChange(false)}
        >
          취소
        </Button>
        <Button size="lg" className="h-[46px] px-[22px]" onClick={onSave}>
          저장
        </Button>
      </div>
    </Modal>
  )
}
