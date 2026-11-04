import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import type { CourseDay } from '../model/types'

/** 일차 탭: 색 점 + "1일차" + 날짜 또는 장소 수 (디자인 09, 10, 11-2) */
export function DayTabs({
  days,
  value,
  onChange,
  detail,
  className,
}: {
  days: CourseDay[]
  value: number
  onChange: (day: number) => void
  /** 탭 오른쪽 작은 글씨. 없으면 날짜·요일 */
  detail?: (day: CourseDay) => string
  className?: string
}) {
  return (
    <div role="tablist" aria-label="일차" className={cn('flex gap-6', className)}>
      {days.map((d) => {
        const active = d.day === value
        return (
          <button
            key={d.day}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(d.day)}
            className={cn(
              '-mb-px flex items-center gap-[7px] border-b-2 py-2.5 text-[15px] font-bold',
              active ? 'text-ink' : 'border-transparent text-muted',
            )}
            style={active ? { borderColor: dayColor(d.day) } : undefined}
          >
            <span className="size-2 rounded-full" style={{ background: dayColor(d.day) }} />
            {d.day}일차
            <span className={cn('font-mono text-xs font-medium', active && 'text-sub')}>
              {detail ? detail(d) : `${d.date} ${d.weekday}`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
