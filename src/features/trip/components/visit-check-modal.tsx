import { useState } from 'react'
import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import { Button, Modal } from '@/shared/ui'
import { StarRating } from './star-rating'

type VisitPlace = { id: string; name: string; visited?: boolean; rating: number }

/** 방문 확인: 장소별 다녀왔는지 + 만족도 (시안 E-3) · FUNC-003-09 */
export function VisitCheckModal({
  open,
  onOpenChange,
  title,
  period,
  planName,
  places,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  period: string
  planName: string
  places: Record<number, VisitPlace[]>
  onSave: (visited: number, total: number) => void
}) {
  const [items, setItems] = useState(places)
  const [day, setDay] = useState(1)
  const days = Object.keys(items).map(Number)
  const all = Object.values(items).flat()
  const visited = all.filter((p) => p.visited).length

  const update = (id: string, patch: Partial<VisitPlace>) =>
    setItems((prev) => ({
      ...prev,
      [day]: prev[day].map((p) =>
        p.id === id
          ? { ...p, ...patch, rating: patch.visited === false ? 0 : (patch.rating ?? p.rating) }
          : p,
      ),
    }))

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={
        <span className="text-sm">
          <span className="font-mono">{period}</span> · {planName} · 다녀온 곳과 만족도를 알려
          주세요
        </span>
      }
      className="w-[640px] gap-4 rounded-[20px]"
    >
      <div role="tablist" aria-label="일차" className="flex gap-5 border-b border-line">
        {days.map((d) => (
          <button
            key={d}
            type="button"
            role="tab"
            aria-selected={d === day}
            onClick={() => setDay(d)}
            className={cn(
              '-mb-px flex items-center gap-1.5 border-b-2 py-2 text-sm font-bold',
              d === day ? 'text-ink' : 'border-transparent text-muted',
            )}
            style={d === day ? { borderColor: dayColor(d) } : undefined}
          >
            <span style={{ color: dayColor(d) }}>●</span>
            {d}일차{' '}
            <span className="font-mono text-xs font-medium text-sub">
              {items[d].filter((p) => p.visited).length}/{items[d].length}
            </span>
          </button>
        ))}
      </div>
      <ul className="flex flex-col">
        {items[day].map((p, i) => (
          <li
            key={p.id}
            className="grid grid-cols-[24px_1fr_200px_130px] items-center gap-3 border-b border-surface py-2.5 last:border-b-0"
          >
            <span
              className="grid size-[22px] place-items-center rounded-full font-mono text-[11px] font-semibold text-white"
              style={{ background: dayColor(day) }}
            >
              {i + 1}
            </span>
            <span className="text-[15px] font-semibold">{p.name}</span>
            <div
              role="radiogroup"
              aria-label={`${p.name} 방문 여부`}
              className="inline-flex gap-1 rounded-[10px] bg-field p-1"
            >
              {[
                { v: true, label: '다녀왔어요' },
                { v: false, label: '못 갔어요' },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  role="radio"
                  aria-checked={p.visited === o.v}
                  onClick={() => update(p.id, { visited: o.v })}
                  className={cn(
                    'rounded-lg px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap',
                    p.visited === o.v
                      ? 'bg-white text-ink shadow-[0_1px_3px_rgba(30,36,32,.12)]'
                      : 'text-sub',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <StarRating
              label={`${p.name} 만족도`}
              value={p.rating}
              disabled={!p.visited}
              onChange={(rating) => update(p.id, { rating })}
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-sub">
          방문{' '}
          <b className="font-mono text-ink">
            {visited}/{all.length}
          </b>{' '}
          · 나머지는 나중에 해도 돼요
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            나중에
          </Button>
          <Button onClick={() => onSave(visited, all.length)}>저장</Button>
        </div>
      </div>
    </Modal>
  )
}
