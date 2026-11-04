import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronLeft, GripVertical, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import {
  AddPlaceModal,
  CourseMap,
  DayTabs,
  editPlan,
  MemoModal,
  StayTimeModal,
  type EditItem,
} from '@/features/trip'
import { addPlaceCandidates, demoCourse, editDemo, editItems } from '@/mocks/data/course'
import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import { MapPanel } from '@/shared/map'
import {
  Button,
  ConfirmDialog,
  LeftPanel,
  MoreMenu,
  PanelTray,
  SplitLayout,
  Toast,
  WarningText,
} from '@/shared/ui'

type Dialog =
  | { type: 'stay'; item: EditItem }
  | { type: 'memo'; item: EditItem }
  | { type: 'add' }
  | { type: 'leave' }

type Notice = { text: string; undo?: () => void }

/** 여행 상세 "직접 만들기"로 만든 일정안(p-new-…)은 빈 상태로 시작한다 */
const emptyDays = (): editPlan.EditDays =>
  Object.fromEntries(demoCourse.days.map((d) => [d.day, []]))

const cloneDays = (): editPlan.EditDays =>
  Object.fromEntries(
    Object.entries(editItems).map(([d, items]) => [d, items.map((i) => ({ ...i }))]),
  )

/**
 * 일정 편집 (디자인 10) · FUNC-003-06, 004-02, 06
 * 끌어서 순서 바꾸기(dnd-kit), 항목 메뉴(다른 일차로 옮기기·체류 시간·메모·삭제), 장소 추가,
 * 순서가 바뀌면 임시 직선 + "경로 다시 계산". `?state=reordered`는 디자인 10처럼 끌던 중 상태.
 */
export default function PlanEditPage() {
  const navigate = useNavigate()
  const { tripId, planId } = useParams()
  const [params] = useSearchParams()
  const demo = params.get('state') === 'reordered'

  const [day, setDay] = useState(1)
  const [days, setDays] = useState(planId?.startsWith('p-new') ? emptyDays : cloneDays)
  const [staleDays, setStaleDays] = useState<number[]>(demo ? [1] : [])
  const [changes, setChanges] = useState(demo ? editDemo.unsavedChanges : 0)
  const [selectedId, setSelectedId] = useState<string | undefined>(
    demo ? editDemo.draggingId : undefined,
  )
  const [title, setTitle] = useState(demoCourse.title)
  const [dialog, setDialog] = useState<Dialog>()
  const [notice, setNotice] = useState<Notice>()

  const items = days[day]
  const totalPlaces = Object.values(days).flat().length
  const full = totalPlaces >= editPlan.MAX_PLACES
  const stale = staleDays.includes(day)
  const warnings = Object.values(days)
    .flat()
    .filter((i) => i.warning).length
  const dayLabel = (d: number) => `${d}일차`

  /** 일정을 바꾸고, 순서·구성이 바뀐 일차는 경로를 임시 직선으로 둔다 */
  const update = (next: editPlan.EditDays, staleFor: number[]) => {
    setDays(next)
    setStaleDays((prev) => [...new Set([...prev, ...staleFor])])
    setChanges((n) => n + 1)
  }
  const updateItem = (id: string, fn: (item: EditItem) => EditItem) =>
    update({ ...days, [day]: items.map((i) => (i.id === id ? fn(i) : i)) }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = items.findIndex((i) => i.id === active.id)
    const to = items.findIndex((i) => i.id === over.id)
    update({ ...days, [day]: editPlan.reorder(items, from, to) }, [day])
    setSelectedId(String(active.id))
  }

  const remove = (item: EditItem) => {
    const before = days
    const beforeStale = staleDays
    update({ ...days, [day]: items.filter((i) => i.id !== item.id) }, [day])
    setNotice({
      text: `${item.name}을(를) 뺐어요`,
      undo: () => {
        setDays(before)
        setStaleDays(beforeStale)
        setChanges((n) => Math.max(0, n - 1))
      },
    })
  }

  const recalc = () => {
    setDays({ ...days, [day]: editPlan.retime(items) })
    setStaleDays((prev) => prev.filter((d) => d !== day))
    setNotice({ text: `${dayLabel(day)} 경로와 시각을 다시 계산했어요` })
  }

  return (
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-col gap-3.5 px-6 pt-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="뒤로"
                onClick={() => (changes > 0 ? setDialog({ type: 'leave' }) : navigate(-1))}
                className="text-sub hover:text-ink"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="여행 이름"
                className="h-11 flex-1 rounded-[10px] border border-line px-3 text-lg font-bold outline-none focus:border-sky"
              />
              <span className="text-[13px] font-semibold text-sub">
                기간 <span className="font-mono text-ink">{editDemo.period}</span>
              </span>
            </div>
            <div className="flex items-center border-b border-line">
              <DayTabs
                days={demoCourse.days}
                value={day}
                onChange={(d) => {
                  setDay(d)
                  setSelectedId(undefined)
                }}
                detail={(d) => `${days[d.day].length}곳`}
              />
              <WarningText className="ml-auto text-[13px]">경고 {warnings}</WarningText>
            </div>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
            accessibility={{
              screenReaderInstructions: {
                draggable: '스페이스로 집고, 위·아래 화살표로 옮긴 뒤 스페이스로 놓아요.',
              },
            }}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <ol
                aria-label={`${dayLabel(day)} 일정`}
                className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 pt-3.5 pb-[100px]"
              >
                {items.map((item, i) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    n={i + 1}
                    day={day}
                    selected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    menu={[
                      ...demoCourse.days
                        .filter((d) => d.day !== day)
                        .map((d) => ({
                          label: `${dayLabel(d.day)}로 옮기기`,
                          onSelect: () => {
                            update(editPlan.moveToDay(days, item.id, d.day), [day, d.day])
                            setNotice({
                              text: `${item.name}을(를) ${dayLabel(d.day)} 끝으로 옮겼어요`,
                            })
                          },
                        })),
                      {
                        label: '체류 시간 바꾸기',
                        onSelect: () => setDialog({ type: 'stay', item }),
                      },
                      {
                        label: item.memo ? '메모 수정' : '메모 추가',
                        onSelect: () => setDialog({ type: 'memo', item }),
                      },
                      { label: '삭제', danger: true, onSelect: () => remove(item) },
                    ]}
                  />
                ))}
                {items.length === 0 && (
                  <li className="py-10 text-center text-sm text-sub">이 날은 아직 장소가 없어요</li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => setDialog({ type: 'add' })}
                    disabled={full}
                    className="mt-1 flex h-[46px] w-full items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-line-strong text-sm font-semibold text-sky-text hover:bg-sky-soft disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
                  >
                    {!full && <Plus size={14} strokeWidth={2.5} />}
                    {full
                      ? `일정안에는 장소를 ${editPlan.MAX_PLACES}곳까지 담을 수 있어요`
                      : '장소 추가 (찜 · 검색 · 식사·숙소 추천)'}
                  </button>
                </li>
              </ol>
            </SortableContext>
          </DndContext>
          <PanelTray className="gap-2.5 pl-[18px]">
            <span className="flex-1 text-[13px] text-sub">
              저장 안 된 변경 <span className="font-mono font-semibold text-ink">{changes}</span> ·
              경고가 있어도 저장할 수 있어요
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="px-3.5"
              onClick={() => (changes > 0 ? setDialog({ type: 'leave' }) : navigate(-1))}
            >
              취소
            </Button>
            <Button
              size="sm"
              className="px-[18px]"
              onClick={() => navigate(`/trips/${tripId ?? 't-palace'}`)}
            >
              저장하기
            </Button>
          </PanelTray>
        </LeftPanel>
      }
      right={
        <>
          <CourseMap
            activeDay={day}
            routes={[
              {
                day,
                points: items.map((i) => i.point),
                modes: stale ? items.slice(1).map(() => 'temp' as const) : undefined,
              },
            ]}
          />
          {stale && (
            <MapPanel className="top-4 left-1/2 flex -translate-x-1/2 items-center gap-3.5 rounded-full bg-ink py-[7px] pr-[7px] pl-[18px] text-sm whitespace-nowrap text-white shadow-[0_4px_14px_rgba(30,36,32,.2)]">
              순서가 바뀌어 임시로 직선 연결했어요
              <button
                type="button"
                onClick={recalc}
                className="rounded-full bg-sky px-3.5 py-[7px] font-semibold hover:bg-[#178BD3]"
              >
                경로 다시 계산
              </button>
            </MapPanel>
          )}

          {dialog?.type === 'stay' && (
            <StayTimeModal
              open
              onOpenChange={() => setDialog(undefined)}
              placeName={dialog.item.name}
              current={editPlan.stayMinutes(dialog.item)}
              onConfirm={(minutes) => {
                updateItem(dialog.item.id, (i) => editPlan.withStay(i, minutes))
                setStaleDays((prev) => [...new Set([...prev, day])])
                setDialog(undefined)
              }}
            />
          )}
          {dialog?.type === 'memo' && (
            <MemoModal
              open
              onOpenChange={() => setDialog(undefined)}
              placeName={dialog.item.name}
              initial={dialog.item.memo}
              onSave={(memo) => {
                updateItem(dialog.item.id, (i) => ({ ...i, memo: memo || undefined }))
                setDialog(undefined)
              }}
            />
          )}
          {dialog?.type === 'add' && (
            <AddPlaceModal
              open
              onOpenChange={() => setDialog(undefined)}
              dayLabel={dayLabel(day)}
              candidates={addPlaceCandidates}
              addedIds={Object.values(days)
                .flat()
                .map((i) => i.id)}
              onAdd={(c) => {
                const start = editPlan.nextStart(items)
                const added: EditItem = {
                  id: c.id,
                  name: c.name,
                  time: editPlan.formatRange(start, start + c.stay),
                  point: c.point,
                }
                update({ ...days, [day]: [...items, added] }, [day])
                setSelectedId(c.id)
              }}
            />
          )}
          <ConfirmDialog
            open={dialog?.type === 'leave'}
            onOpenChange={() => setDialog(undefined)}
            title="저장하지 않고 나갈까요?"
            description={`바꾼 내용 ${changes}개가 사라져요.`}
            tone="danger"
            cancelLabel="계속 편집"
            confirmLabel="나가기"
            onConfirm={() => navigate(-1)}
          />
          {notice && (
            <Toast
              key={notice.text}
              onClose={() => setNotice(undefined)}
              action={
                notice.undo && (
                  <button
                    type="button"
                    onClick={() => {
                      notice.undo?.()
                      setNotice(undefined)
                    }}
                    className="rounded-full bg-sky px-3.5 py-1.5 font-semibold"
                  >
                    되돌리기
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

function SortableRow({
  item,
  n,
  day,
  selected,
  onSelect,
  menu,
}: {
  item: EditItem
  n: number
  day: number
  selected: boolean
  onSelect: () => void
  menu: { label: string; onSelect: () => void; danger?: boolean }[]
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  return (
    <li
      ref={setNodeRef}
      onClick={onSelect}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      aria-current={selected || undefined}
      className={cn(
        'relative grid cursor-pointer grid-cols-[18px_28px_minmax(0,1fr)_28px] items-center gap-2.5 rounded-xl py-3 pr-3 pl-2',
        isDragging
          ? 'z-10 scale-[1.01] bg-sky-soft shadow-[0_0_0_1.5px_var(--color-sky),0_10px_24px_rgba(30,36,32,.16)]'
          : selected
            ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
            : item.warning
              ? 'bg-warn-soft shadow-[inset_0_0_0_1px_#E3C68A]'
              : 'bg-white shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`${item.name} 끌어서 순서 바꾸기`}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'grid h-8 touch-none place-items-center rounded text-[#A3AAB0] hover:text-sub',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
      >
        <GripVertical size={14} />
      </button>
      <span
        className="grid size-6 place-items-center rounded-full font-mono text-[11px] font-semibold text-white"
        style={{ background: dayColor(day) }}
      >
        {n}
      </span>
      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[15px] font-semibold">{item.name}</span>
        <span className="font-mono text-xs font-medium text-sub">{item.time}</span>
        {item.warning && <WarningText>{item.warning}</WarningText>}
        {item.memo && (
          <span className="truncate text-xs text-sub">
            <span className="font-semibold text-ink">메모</span> {item.memo}
          </span>
        )}
      </span>
      <MoreMenu label={`${item.name} 메뉴`} items={menu} />
    </li>
  )
}
