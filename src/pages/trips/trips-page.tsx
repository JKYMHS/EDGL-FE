import { Plus, X } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  CourseMap,
  NewTripModal,
  PlanStatusChip,
  VisitCheckModal,
  type TripSummary,
} from '@/features/trip'
import {
  demoCourse,
  newTripOptions,
  tripListFocus,
  tripPlans,
  trips,
  visitCheckDemo,
} from '@/mocks/data/course'
import { cn } from '@/shared/lib/cn'
import { Button, Chip, LeftPanel, SplitLayout, SyncBadge, Toast } from '@/shared/ui'

type Filter = 'all' | 'upcoming' | 'past' | 'unconfirmed'

const GRID = 'grid grid-cols-[minmax(0,2.3fr)_minmax(0,1.15fr)_64px_110px_72px] gap-3'
const GROUP_LABEL = { upcoming: '다가오는 여행', past: '지난 여행' } as const

function matches(trip: TripSummary, filter: Filter) {
  if (filter === 'all') return true
  if (filter === 'unconfirmed') return Boolean(trip.unconfirmed)
  return trip.group === filter
}

/** 내 여행 목록 (디자인 11-1, 시안 E-1 새 여행·E-3 방문 확인) · FUNC-003-09, 004-01, 004-03 */
export default function TripsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [modal, setModal] = useState<'new' | 'visit' | undefined>(
    params.get('modal') === 'new' ? 'new' : params.get('modal') === 'visit' ? 'visit' : undefined,
  )
  // 여행이 끝난 다음 날부터 "다녀오셨나요?" 배너 (FUNC-003-09)
  const [visitBanner, setVisitBanner] = useState(
    params.get('visit') === '1' || params.get('modal') === 'visit',
  )
  const [toast, setToast] = useState<string>()
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState(tripListFocus.tripId)
  const visible = trips.filter((t) => matches(t, filter))
  const selected = trips.find((t) => t.id === selectedId)
  const count = (f: Filter) => trips.filter((t) => matches(t, f)).length
  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'upcoming', label: '다가오는' },
    { value: 'past', label: '지난' },
    { value: 'unconfirmed', label: '확정 전' },
  ]

  return (
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-col gap-3.5 px-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[3px]">
                <h1 className="text-[22px] font-bold tracking-[-0.01em]">
                  내 여행{' '}
                  <span className="font-mono text-sm font-semibold text-sky-text">
                    {trips.length}
                  </span>
                </h1>
                <p className="text-[13px] text-sub">
                  여행마다 일정안을 여러 개 두고, 하나를 확정해요
                </p>
              </div>
              <Button size="sm" onClick={() => setModal('new')}>
                <Plus size={14} strokeWidth={2.5} />새 여행
              </Button>
            </div>
            {visitBanner && (
              <div className="flex items-center gap-3 rounded-xl bg-sky-soft px-4 py-3.5 shadow-[inset_0_0_0_1.5px_var(--color-sky)]">
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-bold">
                    {visitCheckDemo.title}, 다녀오셨나요?
                  </span>
                  <span className="text-[13px] text-sub">
                    다녀온 곳을 체크하면 다음 추천이 더 잘 맞아요
                  </span>
                </span>
                <Button size="sm" onClick={() => setModal('visit')}>
                  방문 확인
                </Button>
                <button
                  type="button"
                  aria-label="배너 닫기"
                  onClick={() => setVisitBanner(false)}
                  className="text-muted"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              {filters.map((f) => (
                <Chip
                  key={f.value}
                  selected={filter === f.value}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label} {count(f.value)}
                </Chip>
              ))}
            </div>
          </div>
          <div
            className={cn(
              GRID,
              'border-b border-line px-6 pt-[18px] pb-2 text-xs font-semibold text-sub',
            )}
          >
            <span>여행</span>
            <span className="text-sky-text">기간 ↑</span>
            <span>일정안</span>
            <span>캘린더</span>
            <span />
          </div>
          <div className="flex-1 overflow-y-auto px-3 pt-1 pb-6">
            {(['upcoming', 'past'] as const).map((group) => {
              const rows = visible.filter((t) => t.group === group)
              if (rows.length === 0) return null
              return (
                <Fragment key={group}>
                  <div className="px-3 pt-3.5 pb-1.5 text-xs font-bold tracking-[0.02em] text-sub">
                    {GROUP_LABEL[group]} {rows.length}
                  </div>
                  {rows.map((trip) => {
                    const on = trip.id === selectedId
                    return (
                      <div
                        key={trip.id}
                        role="row"
                        aria-selected={on}
                        onClick={() => setSelectedId(trip.id)}
                        onDoubleClick={() => navigate(`/trips/${trip.id}`)}
                        className={cn(
                          GRID,
                          'cursor-pointer items-center rounded-[10px] px-3 py-2.5',
                          on
                            ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                            : 'hover:bg-[#F5F8FA]',
                          trip.group === 'past' && 'opacity-60',
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="h-10 w-[52px] shrink-0 rounded-lg"
                            style={{ background: trip.thumb }}
                          />
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate text-[15px] font-semibold">{trip.title}</span>
                            <span
                              className={cn(
                                'truncate text-xs',
                                trip.unconfirmed ? 'text-warn' : 'text-sub',
                              )}
                            >
                              {trip.subtitle}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-[13px] font-medium">{trip.period}</span>
                        <span className="font-mono text-[13px] font-medium">{trip.planCount}</span>
                        <SyncBadge state={trip.sync} className="justify-self-start text-[11px]" />
                        <span className="text-right font-mono text-xs font-bold">{trip.dday}</span>
                      </div>
                    )
                  })}
                </Fragment>
              )
            })}
          </div>
        </LeftPanel>
      }
      right={
        <>
          <CourseMap
            dimOthers={false}
            routes={demoCourse.days.map((d) => ({ day: d.day, points: demoCourse.points[d.day] }))}
          />
          {selected && selected.id === tripListFocus.tripId && (
            <div className="absolute right-5 bottom-5 left-5 z-20 flex flex-col gap-3 rounded-2xl bg-white px-5 py-[18px] shadow-[0_10px_28px_rgba(30,36,32,.18)]">
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[17px] font-bold">{selected.title}</span>
                  <span className="text-[13px] text-sub">
                    {tripListFocus.meta} · <span className="font-mono">{tripListFocus.period}</span>{' '}
                    · {tripListFocus.companion}
                  </span>
                </div>
                <Button asChild size="sm">
                  <Link to={`/trips/${selected.id}`}>여행 열기</Link>
                </Button>
              </div>
              <ul className="flex flex-col border-t border-surface">
                {tripPlans.map((p) => (
                  <li
                    key={p.id}
                    className="grid grid-cols-[72px_minmax(0,1fr)_64px_56px] items-center gap-3 border-b border-surface py-[9px] text-sm"
                  >
                    <PlanStatusChip status={p.status} />
                    <span className="font-semibold">{p.name}</span>
                    <span className="font-mono text-xs font-medium text-sub">{p.places}곳</span>
                    <span className="text-right font-mono text-xs font-medium text-sub">
                      {p.moveTime}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <NewTripModal
            open={modal === 'new'}
            onOpenChange={(open) => !open && setModal(undefined)}
            regions={newTripOptions.regions}
            companions={newTripOptions.companions}
            onCreate={() => navigate('/trips/t-busan')}
          />
          {modal === 'visit' && (
            <VisitCheckModal
              open
              onOpenChange={(open) => !open && setModal(undefined)}
              title={visitCheckDemo.title}
              period={visitCheckDemo.period}
              planName={visitCheckDemo.planName}
              places={visitCheckDemo.places}
              onSave={(visited, total) => {
                setModal(undefined)
                setVisitBanner(false)
                setToast(`방문 ${visited}/${total}을 저장했어요`)
              }}
            />
          )}
          {toast && <Toast onClose={() => setToast(undefined)}>{toast}</Toast>}
        </>
      }
    />
  )
}
