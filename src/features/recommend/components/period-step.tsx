import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { daysBetween } from '@/shared/lib/date'
import { cn } from '@/shared/lib/cn'
import { Segmented } from '@/shared/ui'
import type { CalendarDay } from '../model/types'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']
/** 최대 3박 4일 (PRD 8.1) */
const MAX_NIGHTS = 3

function nextRange(start: string | undefined, end: string | undefined, clicked: string) {
  if (!start || end || clicked < start || daysBetween(start, clicked) > MAX_NIGHTS) {
    return { start: clicked, end: undefined }
  }
  return { start, end: clicked }
}

/** 07-2 기간·첫날 시작 시간 */
export function PeriodStep({
  year,
  month,
  weeks,
  pastBefore,
  start,
  end,
  startTime,
  startTimeOptions,
  preferenceLabel,
  onRangeChange,
  onStartTimeChange,
}: {
  year: number
  month: number
  weeks: CalendarDay[][]
  pastBefore: string
  start?: string
  end?: string
  startTime: string
  startTimeOptions: readonly string[]
  preferenceLabel: string
  onRangeChange: (range: { start?: string; end?: string }) => void
  onStartTimeChange: (time: string) => void
}) {
  const [monthPickerOpen, setMonthPickerOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-[10px] border border-line pr-3 pl-3.5 font-mono text-[15px] font-semibold"
            >
              {year}
              <span className="font-sans text-sm">년</span>
              <span className="text-xs text-muted">▾</span>
            </button>
            <button
              type="button"
              aria-expanded={monthPickerOpen}
              onClick={() => setMonthPickerOpen((v) => !v)}
              className={cn(
                'flex h-10 items-center gap-2 rounded-[10px] border border-line pr-3 pl-3.5 font-mono text-[15px] font-semibold',
                monthPickerOpen &&
                  'border-[1.5px] border-sky shadow-[0_0_0_4px_var(--color-sky-soft)]',
              )}
            >
              {month}
              <span className="font-sans text-sm">월</span>
              <span className={cn('text-xs', monthPickerOpen ? 'text-sky-text' : 'text-muted')}>
                {monthPickerOpen ? '▴' : '▾'}
              </span>
            </button>
            <button type="button" className="h-10 px-3 text-[13px] font-semibold text-sky-text">
              오늘로
            </button>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="이전 달"
              disabled
              className="grid size-10 place-items-center rounded-[10px] border border-line text-[#A3AAB0]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="다음 달"
              className="grid size-10 place-items-center rounded-[10px] border border-line"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          {monthPickerOpen && (
            <div className="absolute top-12 left-24 z-10 grid w-[280px] grid-cols-4 gap-1.5 rounded-[14px] bg-white p-3 shadow-[0_12px_32px_rgba(30,36,32,.18)]">
              <span className="col-span-full px-1 pt-0.5 pb-1.5 text-xs font-semibold text-sub">
                {year}년
              </span>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <button
                  key={m}
                  type="button"
                  disabled={m < month}
                  onClick={() => setMonthPickerOpen(false)}
                  className={cn(
                    'h-10 rounded-[9px] text-sm font-semibold',
                    m === month
                      ? 'bg-sky text-white'
                      : m < month
                        ? 'text-[#C4CACF]'
                        : 'hover:bg-field',
                  )}
                >
                  {m}월
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-sub">
          {WEEKDAYS.map((d) => (
            <span key={d} className={cn(d === '토' && 'text-day-2', d === '일' && 'text-day-1')}>
              {d}
            </span>
          ))}
        </div>
        <div role="grid" aria-label={`${year}년 ${month}월`} className="grid grid-cols-7 gap-1.5">
          {weeks.flat().map((d) => {
            const isStart = d.key === start
            const isEnd = d.key === end
            const inRange = start && end && d.key > start && d.key < end
            const past = d.key < pastBefore
            const picked = isStart || isEnd
            return (
              <button
                key={d.key}
                type="button"
                role="gridcell"
                aria-selected={picked || Boolean(inRange)}
                disabled={past}
                onClick={() => onRangeChange(nextRange(start, end, d.key))}
                className={cn(
                  'flex h-14 flex-col items-center justify-center gap-0.5 rounded-[10px] font-mono text-base font-medium',
                  (past || d.outside) && !picked && 'text-sub',
                  d.today && !picked && 'font-semibold shadow-[inset_0_0_0_1px_var(--color-line)]',
                  inRange && 'bg-sky-soft',
                  picked && 'bg-sky font-bold text-white',
                  !past && !picked && !inRange && 'hover:bg-field',
                )}
              >
                {d.day}
                {(d.today || picked) && (
                  <span
                    className={cn(
                      'font-sans text-[10px] font-semibold',
                      !picked && 'text-sky-text',
                    )}
                  >
                    {isStart ? '가는 날' : isEnd ? '오는 날' : '오늘'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-[200px_minmax(0,1fr)] items-center gap-6 border-t border-surface pt-5">
        <div className="flex flex-col gap-[3px]">
          <span className="text-[15px] font-bold">첫날 시작 시간</span>
          <span className="text-[13px] text-sub">취향 설정: {preferenceLabel}</span>
        </div>
        <Segmented
          label="첫날 시작 시간"
          value={startTime}
          onChange={onStartTimeChange}
          className="w-max rounded-[10px]"
          items={[
            ...startTimeOptions.map((t) => ({
              value: t,
              label: <span className="font-mono">{t}</span>,
            })),
            { value: 'custom', label: '직접' },
          ]}
        />
      </div>
    </>
  )
}
