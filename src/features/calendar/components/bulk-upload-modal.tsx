import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button, CheckMark, DdayBadge, Modal } from '@/shared/ui'

type BulkTrip = {
  id: string
  title: string
  planName: string
  events: number
  period: string
  dday: string
  past: boolean
}
type Failure = { time: string; name: string; reason: string }

/**
 * 확정된 여행 일괄 업로드 (시안 D-1) → 결과 (D-2) · FUNC-005-02.
 * 다가오는 여행은 기본으로 체크, 지난 여행은 꺼 둔다. 결과에서는 실패한 것만 다시 올린다.
 */
export function BulkUploadModal({
  open,
  onOpenChange,
  account,
  trips,
  unconfirmedTitle,
  calendars,
  failures,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: string
  trips: BulkTrip[]
  unconfirmedTitle?: string
  calendars: string[]
  failures: Record<string, Failure[]>
}) {
  const [picked, setPicked] = useState(trips.filter((t) => !t.past).map((t) => t.id))
  const [calendar, setCalendar] = useState(calendars[0])
  const [done, setDone] = useState(false)
  const [retried, setRetried] = useState(false)

  const pickedTrips = trips.filter((t) => picked.includes(t.id))
  const events = pickedTrips.reduce((sum, t) => sum + t.events, 0)
  const failCount = retried
    ? 0
    : pickedTrips.reduce((sum, t) => sum + (failures[t.id]?.length ?? 0), 0)
  const toggle = (id: string) =>
    setPicked((l) => (l.includes(id) ? l.filter((v) => v !== id) : [...l, id]))

  if (done) {
    return (
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={`일정 ${events - failCount}개를 올렸어요`}
        className="w-[600px] gap-[18px] rounded-[20px]"
      >
        <div className="flex gap-2">
          <span className="rounded-md bg-done-soft px-2.5 py-[5px] text-[13px] font-semibold text-done">
            ✓ 성공 {events - failCount}
          </span>
          {failCount > 0 && (
            <span className="rounded-md bg-[#FBECEA] px-2.5 py-[5px] text-[13px] font-semibold text-error">
              ✕ 실패 {failCount}
            </span>
          )}
        </div>
        <ul className="flex flex-col border-t border-surface">
          {pickedTrips.map((t) => {
            const fails = retried ? [] : (failures[t.id] ?? [])
            return (
              <li key={t.id} className="border-b border-surface py-3">
                <div className="flex items-center justify-between">
                  <span className="flex flex-col">
                    <span className="text-[15px] font-semibold">{t.title}</span>
                    <span className="font-mono text-xs text-sub">{t.period}</span>
                  </span>
                  <span
                    className={cn(
                      'rounded-md px-[9px] py-[3px] text-xs font-semibold',
                      fails.length ? 'bg-warn-soft text-warn' : 'bg-done-soft text-done',
                    )}
                  >
                    ● {t.events - fails.length}/{t.events}
                    {fails.length === 0 && ' 동기화됨'}
                  </span>
                </div>
                {fails.map((f) => (
                  <p
                    key={f.name}
                    className="mt-2 rounded-lg bg-[#FBECEA] px-3 py-2 text-[13px] text-error"
                  >
                    ✕ {f.time} {f.name} — {f.reason}
                  </p>
                ))}
              </li>
            )
          })}
        </ul>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          {failCount > 0 && (
            <Button onClick={() => setRetried(true)}>실패한 {failCount}개 다시 올리기</Button>
          )}
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`확정된 여행 ${trips.length}개를 캘린더에 올릴까요?`}
      description={
        <>
          연동됐어요 · <b className="text-done">● {account}</b>
        </>
      }
      className="w-[600px] gap-[18px] rounded-[20px]"
    >
      <ul className="flex flex-col gap-1.5">
        {trips.map((t) => {
          const on = picked.includes(t.id)
          return (
            <li key={t.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(t.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left',
                  on
                    ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                    : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
                  t.past && !on && 'opacity-70',
                )}
              >
                <CheckMark checked={on} />
                <span className="flex flex-1 flex-col">
                  <span className="text-[15px] font-semibold">{t.title}</span>
                  <span className="text-xs text-sub">
                    {t.planName} · 일정 {t.events}개
                  </span>
                </span>
                <span className="font-mono text-[13px]">{t.period}</span>
                {t.past ? (
                  <span className="w-[42px] text-right text-xs font-semibold text-sub">
                    {t.dday}
                  </span>
                ) : (
                  <DdayBadge>{t.dday}</DdayBadge>
                )}
              </button>
            </li>
          )
        })}
      </ul>
      {unconfirmedTitle && (
        <p className="-mt-2 text-xs text-muted">
          확정 전인 여행({unconfirmedTitle})은 일정안을 확정한 뒤 올릴 수 있어요.
        </p>
      )}
      <label className="grid grid-cols-[110px_1fr] items-center gap-3">
        <span className="text-[13px] font-semibold">올릴 캘린더</span>
        <span className="relative">
          <select
            value={calendar}
            onChange={(e) => setCalendar(e.target.value)}
            className="h-11 w-full appearance-none rounded-[10px] border border-line px-3.5 text-[15px] outline-none focus:border-sky"
          >
            {calendars.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sub"
          />
        </span>
      </label>
      <div className="flex items-center justify-between pt-1">
        <span className="text-[13px] text-sub">
          일정 <b className="font-mono text-ink">{events}</b>개
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            나중에
          </Button>
          <Button disabled={picked.length === 0} onClick={() => setDone(true)}>
            {picked.length}개 여행 올리기
          </Button>
        </div>
      </div>
    </Modal>
  )
}
