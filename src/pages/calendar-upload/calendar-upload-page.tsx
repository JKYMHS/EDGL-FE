import { Check, ChevronDown, ChevronLeft } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Link } from 'react-router'
import type { CalendarItem } from '@/features/trip'
import { calendarAccount, calendarItems, calendarMealSlot, demoCourse } from '@/mocks/data/course'
import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import { toHours } from '@/shared/lib/time'
import { Button, LeftPanel, PanelTray } from '@/shared/ui'

const STATE_LABEL: Record<CalendarItem['state'], [string, string, string]> = {
  new: ['새 항목', '●', 'text-sky-text'],
  changed: ['변경 있음', '●', 'text-warn'],
  synced: ['동기화됨', '✓', 'text-done'],
}
const FIRST_HOUR = 9
const HOUR_PX = 48
const HOURS = Array.from({ length: 13 }, (_, i) => FIRST_HOUR + i)

/** 캘린더 일괄 업로드 (디자인 12) · FUNC-005-03, 04. 동기화된 항목은 기본으로 빼 둔다 */
export default function CalendarUploadPage() {
  const [picked, setPicked] = useState(
    calendarItems.filter((i) => i.state !== 'synced').map((i) => i.id),
  )
  const toggle = (id: string) =>
    setPicked((list) => (list.includes(id) ? list.filter((v) => v !== id) : [...list, id]))
  const toggleDay = (day: number) => {
    const ids = calendarItems.filter((i) => i.day === day).map((i) => i.id)
    const allOn = ids.every((id) => picked.includes(id))
    setPicked((list) =>
      allOn ? list.filter((id) => !ids.includes(id)) : [...new Set([...list, ...ids])],
    )
  }
  const count = (state: CalendarItem['state']) =>
    calendarItems.filter((i) => i.state === state && picked.includes(i.id)).length

  return (
    <div className="flex min-h-0 flex-1">
      <LeftPanel>
        <div className="flex flex-col gap-3.5 px-6 pt-6">
          <div className="flex flex-col gap-1">
            <Link
              to="/trips/t-palace"
              className="flex items-center text-[13px] text-sub hover:text-ink"
            >
              <ChevronLeft size={13} />
              고궁과 정동 야행 · 기본 코스{' '}
              <span className="ml-1 font-semibold text-sky-text">(확정)</span>
            </Link>
            <h1 className="text-[22px] font-bold tracking-[-0.01em]">구글 캘린더에 올리기</h1>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <span className="size-8 rounded-lg border border-line bg-field" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold">{calendarAccount.email}</span>
              <span className="text-xs font-semibold text-done">● 연동됨</span>
            </span>
            <Button variant="secondary" size="xs" className="gap-1.5 px-3">
              캘린더: {calendarAccount.calendarName}
              <ChevronDown size={13} />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-1 pb-[100px]">
          {demoCourse.days.map((d) => {
            const color = dayColor(d.day)
            const items = calendarItems.filter((i) => i.day === d.day)
            return (
              <section key={d.day} aria-label={`${d.day}일차`}>
                <div className="flex items-center gap-2.5 pt-3.5 pb-2">
                  <span className="size-3 rounded-full" style={{ background: color }} />
                  <span className="text-sm font-bold">
                    {d.day}일차 · {d.date} {d.weekday}
                  </span>
                  <span className="h-px flex-1 bg-surface" />
                  <button
                    type="button"
                    onClick={() => toggleDay(d.day)}
                    className="text-xs font-semibold text-sky-text"
                  >
                    이 날 전체
                  </button>
                </div>
                {items.map((item, k) => {
                  const on = picked.includes(item.id)
                  const [label, icon, tone] = STATE_LABEL[item.state]
                  const h = Math.max(64, (toHours(item.end) - toHours(item.start)) * 52)
                  return (
                    <Fragment key={item.id}>
                      {calendarMealSlot.day === d.day && calendarMealSlot.before === item.id && (
                        <div className="grid grid-cols-[52px_24px_minmax(0,1fr)] gap-3">
                          <span className="pt-2.5 font-mono text-xs font-medium text-[#A3AAB0]">
                            {calendarMealSlot.start}
                          </span>
                          <span className="flex justify-center">
                            <span className="w-0.5 bg-line" />
                          </span>
                          <div className="my-1 flex justify-between rounded-[10px] border-[1.5px] border-dashed border-line-strong px-3.5 py-[9px] text-[13px] text-muted">
                            <span>{calendarMealSlot.label}</span>
                            <button type="button" className="font-semibold text-sky-text">
                              고르기
                            </button>
                          </div>
                        </div>
                      )}
                      <div
                        className="grid grid-cols-[52px_24px_minmax(0,1fr)] gap-3"
                        style={{ minHeight: h }}
                      >
                        <span className="pt-2.5 font-mono text-xs font-medium text-sub">
                          {item.start}
                        </span>
                        <div className="flex flex-col items-center">
                          <span
                            className="h-2.5 w-0.5"
                            style={{ background: k === 0 ? 'transparent' : color }}
                          />
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            aria-label={`${item.name} 올리기`}
                            onClick={() => toggle(item.id)}
                            className="grid size-5 shrink-0 place-items-center rounded-full border-2 text-white"
                            style={{ borderColor: color, background: on ? color : '#fff' }}
                          >
                            {on && <Check size={11} strokeWidth={4} />}
                          </button>
                          <span className="w-0.5 flex-1 opacity-35" style={{ background: color }} />
                        </div>
                        <div
                          className={cn(
                            'my-1 flex items-start justify-between gap-3 rounded-[10px] px-3.5 py-2.5',
                            on
                              ? 'bg-white shadow-[inset_0_0_0_1px_var(--color-line)]'
                              : 'bg-[#F8FAFB] opacity-60',
                          )}
                        >
                          <span className="flex flex-col gap-0.5">
                            <span className="text-[15px] font-semibold">{item.name}</span>
                            <span className="font-mono text-xs font-medium text-sub">
                              {item.start} – {item.end} · {item.duration}
                            </span>
                          </span>
                          <span className={cn('text-xs font-semibold whitespace-nowrap', tone)}>
                            {icon} {label}
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  )
                })}
              </section>
            )
          })}
        </div>
        <PanelTray className="gap-2.5 pl-[18px]">
          <span className="flex-1 text-[13px] text-sub">
            새 항목 <span className="font-mono font-semibold text-ink">{count('new')}</span> · 변경{' '}
            <span className="font-mono font-semibold text-ink">{count('changed')}</span> · 식사
            시간은 장소를 골라야 올라가요
          </span>
          <Button size="sm" className="px-[18px]" disabled={picked.length === 0}>
            <span className="font-mono">{picked.length}</span>개 올리기
          </Button>
        </PanelTray>
      </LeftPanel>
      <section
        aria-label="캘린더 미리보기"
        className="flex min-w-0 flex-1 flex-col gap-3.5 bg-[#F8FAFB] px-8 py-6"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-bold">캘린더 미리보기</h2>
          <span className="text-xs text-sub">올라갈 모습</span>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden rounded-[14px] bg-white px-4 pt-4 shadow-[inset_0_0_0_1px_var(--color-line)]">
          <div className="grid grid-cols-[48px_1fr_1fr] gap-4 border-b border-surface pb-2.5 text-[13px] font-bold">
            <span />
            {demoCourse.days.map((d) => (
              <span key={d.day}>
                {d.date} {d.weekday}
              </span>
            ))}
          </div>
          <div className="relative flex-1">
            {HOURS.map((h, i) => (
              <div
                key={h}
                className="absolute inset-x-0 border-t border-[#F1F3F5] pt-0.5 font-mono text-[11px] font-medium text-muted"
                style={{ top: i * HOUR_PX }}
              >
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
            {calendarItems
              .filter((i) => picked.includes(i.id) || i.state === 'synced')
              .map((i) => (
                <div
                  key={i.id}
                  className="absolute w-[calc(50%-44px)] overflow-hidden rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold"
                  style={{
                    left: i.day === 1 ? 64 : 'calc(50% + 36px)',
                    top: (toHours(i.start) - FIRST_HOUR) * HOUR_PX,
                    height: (toHours(i.end) - toHours(i.start)) * HOUR_PX - 4,
                    boxShadow: `inset 3px 0 0 ${dayColor(i.day)}, inset 0 0 0 1px var(--color-line)`,
                  }}
                >
                  {i.shortName ?? i.name}
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
