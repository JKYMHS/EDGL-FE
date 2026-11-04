import { ArrowRight } from 'lucide-react'
import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import type { CourseItem } from '../model/types'

const MOVE_LINE = {
  walk: 'border-l-[3px] border-dotted',
  transit: 'border-l-4',
  taxi: 'border-l-[7px]',
} as const

/** 추천 결과 일차 타임라인: 장소 · 이동 · 식사 시간 슬롯 (디자인 09) · FUNC-003-02, 04, 10 */
export function CourseTimeline({
  day,
  items,
  focusedId,
  onFocus,
}: {
  day: number
  items: CourseItem[]
  focusedId?: string
  onFocus: (id: string) => void
}) {
  const color = dayColor(day)
  return (
    <ol className="flex flex-col">
      {items.map((item, i) => {
        if (item.kind === 'move') {
          return (
            <li
              key={i}
              className="grid h-7 grid-cols-[52px_28px_minmax(0,1fr)] items-center gap-3 px-3"
            >
              <span />
              <span className="flex justify-center">
                <span className={cn('h-7', MOVE_LINE[item.mode])} style={{ borderColor: color }} />
              </span>
              <span className="text-xs text-sub">{item.label}</span>
            </li>
          )
        }
        if (item.kind === 'meal') {
          return (
            <li
              key={i}
              className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-3 px-3 py-1.5"
            >
              <span className="font-mono text-[13px] font-medium text-sub">{item.time}</span>
              <div className="ml-10 flex items-center justify-between rounded-[10px] border-[1.5px] border-dashed border-line-strong px-3.5 py-2.5">
                <span className="text-sm font-semibold">{item.label}</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[13px] font-semibold text-sky-text"
                >
                  {item.link} <ArrowRight size={13} strokeWidth={2.5} />
                </button>
              </div>
            </li>
          )
        }
        const focused = item.id === focusedId
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onFocus(item.id)}
              aria-pressed={focused}
              className={cn(
                'grid w-full grid-cols-[52px_28px_minmax(0,1fr)_64px] items-start gap-3 rounded-[10px] px-3 py-2.5 text-left',
                focused
                  ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                  : 'hover:bg-[#F5F8FA]',
              )}
            >
              <span className="pt-[3px] font-mono text-[13px] font-medium text-sub">
                {item.time}
              </span>
              <span
                className="grid size-6 place-items-center rounded-full font-mono text-[11px] font-semibold text-white"
                style={{ background: color }}
              >
                {item.n}
              </span>
              <span className="flex min-w-0 flex-col gap-[3px]">
                <span className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold">{item.name}</span>
                  {item.tag && (
                    <span className="rounded-full bg-sky-soft px-[7px] py-0.5 text-[11px] font-semibold text-sky-text">
                      {item.tag}
                    </span>
                  )}
                </span>
                <span className="text-[13px] text-sub">{item.meta}</span>
                {item.reason && (
                  <span className="text-[13px] leading-[1.45] text-sky-text">{item.reason}</span>
                )}
              </span>
              <span className="h-12 w-16 rounded-lg bg-[#E3E8EC]" />
            </button>
          </li>
        )
      })}
    </ol>
  )
}
