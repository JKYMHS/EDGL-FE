import { ChevronLeft, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  CourseMap,
  DayTabs,
  PLAN_NAME_MAX,
  PlanStatusChip,
  RenameModal,
  TripInfoModal,
  type CourseStop,
  type TripInfo,
  type TripPlan,
} from '@/features/trip'
import {
  demoCourse,
  newTripOptions,
  tripDetail,
  tripPlans as initialPlans,
} from '@/mocks/data/course'
import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import { formatMonthDay } from '@/shared/lib/date'
import { MapPanel } from '@/shared/map'
import {
  Button,
  ConfirmDialog,
  DdayBadge,
  LeftPanel,
  MoreMenu,
  PanelTray,
  SplitLayout,
  Toast,
} from '@/shared/ui'

type Dialog =
  | { type: 'info' }
  | { type: 'rename'; plan: TripPlan }
  | { type: 'confirm'; plan: TripPlan }
  | { type: 'delete-plan'; plan: TripPlan }
  | { type: 'delete-trip' }

type Notice = { text: string; action?: { label: string; onClick: () => void } }

const GRID = 'grid grid-cols-[minmax(0,1fr)_72px_56px_56px_28px] gap-3'

/** 여행 상세 — 일정안 관리 (디자인 11-2) · FUNC-004-04, 05, 08, 005-03 */
export default function TripDetailPage() {
  const navigate = useNavigate()
  const [info, setInfo] = useState<TripInfo>({
    name: tripDetail.title,
    start: tripDetail.start,
    end: tripDetail.end,
    companion: tripDetail.companion,
  })
  const [tripPlans, setPlans] = useState(initialPlans)
  const [planId, setPlanId] = useState(initialPlans[0].id)
  const [day, setDay] = useState(1)
  const [dialog, setDialog] = useState<Dialog>()
  const [notice, setNotice] = useState<Notice>()
  const seq = useRef(0)
  const plan = tripPlans.find((p) => p.id === planId) ?? tripPlans[0]
  const trip = {
    ...tripDetail,
    title: info.name,
    period: `${formatMonthDay(info.start)} – ${formatMonthDay(info.end)}`,
  }
  const hasConfirmed = tripPlans.some((p) => p.status === '확정')
  const close = () => setDialog(undefined)

  const duplicate = (source: TripPlan) => {
    seq.current += 1
    const copy: TripPlan = {
      ...source,
      id: `${source.id}-copy-${seq.current}`,
      name: `${source.name} 사본`.slice(0, PLAN_NAME_MAX),
      status: '초안',
      origin: '방금 복제함',
    }
    setPlans((list) => {
      const i = list.findIndex((p) => p.id === source.id)
      return [...list.slice(0, i + 1), copy, ...list.slice(i + 1)]
    })
    setPlanId(copy.id)
    setNotice({ text: `"${copy.name}"을 만들었어요` })
  }

  const addBlankPlan = () => {
    seq.current += 1
    const blank: TripPlan = {
      id: `p-new-${seq.current}`,
      name: '새 일정안',
      status: '초안',
      places: 0,
      moveTime: '0:00',
      origin: '방금 직접 만듦',
    }
    setPlans((list) => [...list, blank])
    navigate(`/trips/${trip.id}/plans/${blank.id}/edit`)
  }
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
                  {trip.meta} · <span className="font-mono">{trip.period}</span> · {info.companion}{' '}
                  · {tripDetail.departure}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DdayBadge className="px-2 py-1 text-[13px]">{trip.dday}</DdayBadge>
                <Button
                  variant="secondary"
                  size="xs"
                  className="px-3"
                  onClick={() => setDialog({ type: 'info' })}
                >
                  여행 정보 수정
                </Button>
                <MoreMenu
                  label="여행 메뉴"
                  triggerClassName="size-9 rounded-[9px] border border-line text-ink"
                  items={[
                    {
                      label: '여행 복제',
                      onSelect: () =>
                        setNotice({
                          text: `"${trip.title} 사본" 여행을 만들었어요`,
                          action: { label: '내 여행 보기', onClick: () => navigate('/trips') },
                        }),
                    },
                    {
                      label: '여행 삭제',
                      danger: true,
                      onSelect: () => setDialog({ type: 'delete-trip' }),
                    },
                  ]}
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
              <MoreMenu
                label="일정안 추가"
                className="w-[240px]"
                trigger={
                  <Button variant="soft" size="xs" className="px-3">
                    <Plus size={13} strokeWidth={2.5} />
                    일정안 추가
                  </Button>
                }
                items={[
                  {
                    label: 'AI로 추천받기',
                    hint: '이 여행 조건으로 새 코스를 받아요',
                    onSelect: () => navigate(`/recommend?tripId=${trip.id}`),
                  },
                  {
                    label: '직접 만들기',
                    hint: '빈 일정안에 장소를 담아요',
                    onSelect: addBlankPlan,
                  },
                  {
                    label: `"${plan.name}" 복제`,
                    hint: '선택한 일정안을 초안으로 복사해요',
                    onSelect: () => duplicate(plan),
                  },
                ]}
              />
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
                      ...(p.status === '확정'
                        ? []
                        : [
                            {
                              label: '확정으로 바꾸기',
                              onSelect: () => setDialog({ type: 'confirm', plan: p }),
                            },
                          ]),
                      {
                        label: '이름 바꾸기',
                        onSelect: () => setDialog({ type: 'rename', plan: p }),
                      },
                      { label: '복제', onSelect: () => duplicate(p) },
                      {
                        label: '삭제',
                        danger: true,
                        disabled: tripPlans.length === 1,
                        hint: tripPlans.length === 1 ? '마지막 일정안은 지울 수 없어요' : undefined,
                        onSelect: () => setDialog({ type: 'delete-plan', plan: p }),
                      },
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
              <strong className="font-semibold text-ink">{plan.name}</strong> · {plan.status}
              {plan.status === '확정' ? (
                <>
                  {' · '}
                  <span className="font-semibold text-done">● 동기화됨</span>
                </>
              ) : (
                !hasConfirmed && <span className="font-semibold text-warn"> · 아직 확정 전</span>
              )}
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

          {dialog?.type === 'info' && (
            <TripInfoModal
              open
              onOpenChange={close}
              initial={info}
              companions={newTripOptions.companions}
              onSave={(next) => {
                setInfo(next)
                close()
                setNotice({ text: '여행 정보를 저장했어요' })
              }}
            />
          )}
          {dialog?.type === 'rename' && (
            <RenameModal
              open
              onOpenChange={close}
              initial={dialog.plan.name}
              onSave={(name) => {
                setPlans((list) => list.map((p) => (p.id === dialog.plan.id ? { ...p, name } : p)))
                close()
              }}
            />
          )}
          <ConfirmDialog
            open={dialog?.type === 'confirm'}
            onOpenChange={close}
            className="w-[440px]"
            title={dialog?.type === 'confirm' ? `"${dialog.plan.name}"을 확정할까요?` : ''}
            description="지금 확정안은 초안이 되고, 캘린더에 올린 일정은 새 확정안으로 바뀌어요."
            confirmLabel="확정하기"
            onConfirm={() => {
              if (dialog?.type !== 'confirm') return
              setPlans((list) =>
                list.map((p) => ({ ...p, status: p.id === dialog.plan.id ? '확정' : '초안' })),
              )
              setPlanId(dialog.plan.id)
              close()
            }}
          />
          <ConfirmDialog
            open={dialog?.type === 'delete-plan'}
            onOpenChange={close}
            className="w-[440px]"
            tone="danger"
            title={dialog?.type === 'delete-plan' ? `"${dialog.plan.name}"을 삭제할까요?` : ''}
            description={
              dialog?.type === 'delete-plan' && dialog.plan.status === '확정'
                ? '확정안이라 캘린더에 올린 일정도 지워지고, 여행은 "확정 전"이 돼요.'
                : '삭제한 일정안은 되돌릴 수 없어요.'
            }
            confirmLabel="삭제"
            onConfirm={() => {
              if (dialog?.type !== 'delete-plan') return
              const rest = tripPlans.filter((p) => p.id !== dialog.plan.id)
              setPlans(rest)
              if (planId === dialog.plan.id) setPlanId(rest[0].id)
              close()
            }}
          />
          <ConfirmDialog
            open={dialog?.type === 'delete-trip'}
            onOpenChange={close}
            className="w-[440px]"
            tone="danger"
            title="여행을 삭제할까요?"
            description={`일정안 ${tripPlans.length}개와 캘린더에 올린 일정이 함께 지워져요.`}
            confirmLabel="여행 삭제"
            onConfirm={() => navigate('/trips')}
          />
          {notice && (
            <Toast
              key={notice.text}
              onClose={() => setNotice(undefined)}
              action={
                notice.action && (
                  <button
                    type="button"
                    onClick={notice.action.onClick}
                    className="rounded-full bg-sky px-3.5 py-1.5 font-semibold"
                  >
                    {notice.action.label}
                  </button>
                )
              }
            >
              {notice.text}
            </Toast>
          )}
        </>
      }
    />
  )
}
