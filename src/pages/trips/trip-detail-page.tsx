import { ChevronLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { CourseMap, DayTabs, PlanStatusChip, type CourseStop } from '@/features/trip'
import { demoCourse, tripDetail as trip, tripPlans } from '@/mocks/data/course'
import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import { MapPanel } from '@/shared/map'
import { Button, DdayBadge, LeftPanel, MoreMenu, PanelTray, SplitLayout } from '@/shared/ui'

const GRID = 'grid grid-cols-[minmax(0,1fr)_72px_56px_56px_28px] gap-3'

/** 여행 상세 — 일정안 관리 (디자인 11-2) · FUNC-004-04, 05, 08, 005-03 */
export default function TripDetailPage() {
  const navigate = useNavigate()
  const [planId, setPlanId] = useState(tripPlans[0].id)
  const [day, setDay] = useState(1)
  const plan = tripPlans.find((p) => p.id === planId) ?? tripPlans[0]
  const stops = demoCourse.timeline[day].filter((item): item is CourseStop => item.kind === 'place')
  const editPath = `/trips/${trip.id}/plans/${plan.id}/edit`

  return (
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-col gap-4 px-6 pt-5">
            <Link to="/trips" className="flex items-center text-[13px] text-sub hover:text-ink">
              <ChevronLeft size={13} />내 여행
            </Link>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-[26px] font-bold tracking-[-0.015em]">{trip.title}</h1>
                <span className="text-sm text-sub">
                  {trip.meta} · <span className="font-mono">{trip.period}</span> · {trip.extra}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DdayBadge className="px-2 py-1 text-[13px]">{trip.dday}</DdayBadge>
                <Button variant="secondary" size="xs" className="px-3">
                  여행 정보 수정
                </Button>
                <MoreMenu
                  label="여행 메뉴"
                  triggerClassName="size-9 rounded-[9px] border border-line text-ink"
                  items={[{ label: '여행 복제' }, { label: '여행 삭제', danger: true }]}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <h2 className="text-base font-bold">
                일정안{' '}
                <span className="font-mono text-[13px] font-semibold text-sky-text">
                  {tripPlans.length}
                </span>
              </h2>
              <Button variant="soft" size="xs" className="px-3">
                <Plus size={13} strokeWidth={2.5} />
                일정안 추가
              </Button>
            </div>
          </div>
          <div
            className={cn(
              GRID,
              'border-b border-line px-6 pt-2.5 pb-2 text-xs font-semibold text-sub',
            )}
          >
            <span>이름</span>
            <span>상태</span>
            <span>장소</span>
            <span>이동</span>
            <span />
          </div>
          <div className="px-3 pt-1">
            {tripPlans.map((p) => {
              const on = p.id === planId
              return (
                <div
                  key={p.id}
                  role="row"
                  aria-selected={on}
                  onClick={() => setPlanId(p.id)}
                  className={cn(
                    GRID,
                    'cursor-pointer items-center rounded-[10px] px-3 py-2.5',
                    on
                      ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                      : 'hover:bg-[#F5F8FA]',
                  )}
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{p.name}</span>
                    <span className="text-xs text-sub">{p.origin}</span>
                  </span>
                  <PlanStatusChip status={p.status} />
                  <span className="font-mono text-[13px] font-medium">{p.places}곳</span>
                  <span className="font-mono text-[13px] font-medium">{p.moveTime}</span>
                  <MoreMenu
                    label={`${p.name} 메뉴`}
                    triggerClassName="text-muted"
                    items={[
                      { label: '확정으로 바꾸기' },
                      { label: '이름 바꾸기' },
                      { label: '복제' },
                      { label: '삭제', danger: true },
                    ]}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-6 pt-5 pb-24">
            <div className="flex items-center justify-between border-b border-line">
              <DayTabs
                days={demoCourse.days}
                value={day}
                onChange={setDay}
                detail={() => ''}
                className="[&>button]:py-[9px] [&>button]:text-sm"
              />
              <span className="text-xs text-sub">
                {plan.name} 미리보기 ·{' '}
                <Link to={editPath} className="font-semibold text-sky-text">
                  편집
                </Link>
              </span>
            </div>
            <ol className="overflow-y-auto">
              {stops.map((s) => (
                <li
                  key={s.id}
                  className="grid grid-cols-[52px_24px_minmax(0,1fr)] items-center gap-3 py-[7px]"
                >
                  <span className="font-mono text-[13px] font-medium text-sub">{s.time}</span>
                  <span
                    className="grid size-[22px] place-items-center rounded-full font-mono text-[11px] font-semibold text-white"
                    style={{ background: dayColor(day) }}
                  >
                    {s.n}
                  </span>
                  <span className="text-sm font-semibold">{s.name}</span>
                </li>
              ))}
            </ol>
          </div>
          <PanelTray className="gap-2.5 pl-[18px]">
            <span className="flex-1 text-[13px] text-sub">
              <strong className="font-semibold text-ink">{plan.name}</strong> · {plan.status} ·{' '}
              <span className="font-semibold text-done">● 동기화됨</span>
            </span>
            <Button variant="secondary" size="sm" onClick={() => navigate(editPath)}>
              편집
            </Button>
            <Button
              size="sm"
              disabled={plan.status !== '확정'}
              onClick={() => navigate(`/trips/${trip.id}/calendar`)}
            >
              캘린더에 올리기
            </Button>
          </PanelTray>
        </LeftPanel>
      }
      right={
        <>
          <CourseMap
            activeDay={day}
            routes={demoCourse.days.map((d) => ({ day: d.day, points: demoCourse.points[d.day] }))}
          />
          <MapPanel className="top-4 left-4 flex flex-col gap-1 px-3.5 py-3 whitespace-nowrap">
            <span className="flex items-center gap-1 text-[13px] font-bold">
              {plan.name}
              <PlanStatusChip status={plan.status} className="ml-1 px-[7px]" />
            </span>
            <span className="text-xs text-sub">
              확정된 일정안만 캘린더에 올라가요 ·{' '}
              <span className="font-semibold text-done">● 동기화됨</span>
            </span>
          </MapPanel>
        </>
      }
    />
  )
}
