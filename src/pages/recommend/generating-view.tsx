import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { candidateDots, demoCourse, generatingSteps } from '@/mocks/data/course'
import { cn } from '@/shared/lib/cn'
import { MapCanvas, MapPanel, MapPin, NumberMarker, RouteLine } from '@/shared/map'
import { LeftPanel, SplitLayout } from '@/shared/ui'

/** 디자인 08 시점(12초, 3단계)부터 보여 준다. 단계 정보가 없어 시간으로만 진행한다 (TRD 6.2) */
const START_SECONDS = 12
const STEP_SECONDS = 5
const MAX_SECONDS = 30

/** AI 코스 생성 중 (디자인 08) · FUNC-003-02 */
export function GeneratingView({ conditions, onDone }: { conditions: string; onDone: () => void }) {
  const [elapsed, setElapsed] = useState(START_SECONDS)
  const current = Math.min(Math.floor((elapsed - 2) / STEP_SECONDS), generatingSteps.length)
  const points = demoCourse.points[1]
  // 3단계(운영 시간 확인)부터 다섯 곳이 모두 보이고, 확인 중인 곳을 강조한다
  const shown = Math.min(current + 3, points.length)
  const checkingIndex = current + 1

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (current >= generatingSteps.length) onDone()
  }, [current, onDone])

  return (
    <SplitLayout
      left={
        <LeftPanel className="gap-7 p-10">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-sub">{conditions}</span>
            <h1 className="text-[28px] font-bold tracking-[-0.015em]">코스를 짜고 있어요</h1>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[13px] text-sub">
              <span>
                {Math.min(current + 1, generatingSteps.length)} / {generatingSteps.length} 단계
              </span>
              <span className="font-mono">
                {elapsed}초 · 최대 {MAX_SECONDS}초
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="코스 생성 진행"
              aria-valuemin={0}
              aria-valuemax={MAX_SECONDS}
              aria-valuenow={elapsed}
              className="h-1.5 overflow-hidden rounded-[3px] bg-surface"
            >
              <div
                className="h-full rounded-[3px] bg-sky transition-[width] duration-1000"
                style={{ width: `${Math.min((elapsed / (STEP_SECONDS * 5 + 2)) * 100, 100)}%` }}
              />
            </div>
          </div>
          <ol className="flex flex-col">
            {generatingSteps.map((s, i) => {
              const done = i < current
              const active = i === current
              return (
                <li
                  key={s.label}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3.5',
                    active
                      ? 'rounded-[10px] bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                      : 'border-b border-surface last:border-b-0',
                  )}
                >
                  {done ? (
                    <span className="grid size-6 place-items-center rounded-full bg-ink text-white">
                      <Check size={13} strokeWidth={3.5} />
                    </span>
                  ) : active ? (
                    <span className="size-6 animate-spin rounded-full border-[3px] border-sky-line border-t-sky" />
                  ) : (
                    <span className="size-6 rounded-full border-[1.5px] border-line-strong" />
                  )}
                  <span className="flex flex-col gap-0.5">
                    <span
                      className={cn('text-[15px] font-semibold', !done && !active && 'text-muted')}
                    >
                      {s.label}
                    </span>
                    {active && s.detail && (
                      <span className="text-[13px] text-sky-text">{s.detail}</span>
                    )}
                  </span>
                  <span className="font-mono text-xs font-medium text-sub">{done && s.result}</span>
                </li>
              )
            })}
          </ol>
          <div className="mt-auto flex items-center justify-between text-[13px] text-sub">
            <span>30초가 넘으면 기본 추천 코스로 먼저 보여드려요</span>
            <Link to="/recommend?step=5" className="font-semibold text-ink">
              취소
            </Link>
          </div>
        </LeftPanel>
      }
      right={
        <>
          <MapCanvas
            river="none"
            svg={<RouteLine mode="progress" color="#1E9DEB" points={points.slice(0, shown)} />}
          >
            {candidateDots.map((d, i) => (
              <MapPin key={i} point={d}>
                <span className="block size-2.5 rounded-full bg-[#B9C2C8]" />
              </MapPin>
            ))}
            {points.slice(0, shown).map((p, i) => {
              const checking = i === checkingIndex
              return (
                <NumberMarker
                  key={i}
                  point={p}
                  n={i + 1}
                  color="#1E9DEB"
                  size={checking ? 32 : 26}
                  ring={checking ? 'rgba(30,157,235,.2)' : undefined}
                  className="text-[11px] shadow-none"
                />
              )
            })}
            {current === 2 && (
              <MapPin point={points[checkingIndex]} anchor="bottom" z={6} className="-mt-6">
                <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold whitespace-nowrap shadow-[0_2px_8px_rgba(30,36,32,.14)]">
                  덕수궁 · 확인 중
                </span>
              </MapPin>
            )}
          </MapCanvas>
          <MapPanel className="top-4 left-4 flex gap-4 rounded-[10px] px-3.5 py-2.5 text-xs text-sub">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#B9C2C8]" />
              후보
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-sky" />
              선택됨
            </span>
          </MapPanel>
        </>
      }
    />
  )
}
