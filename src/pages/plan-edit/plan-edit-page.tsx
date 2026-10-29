import { ChevronLeft, GripVertical, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CourseMap, DayTabs } from '@/features/trip'
import { demoCourse, editDemo, editItems } from '@/mocks/data/course'
import { dayColor } from '@/shared/config/day-colors'
import { cn } from '@/shared/lib/cn'
import { MapPanel } from '@/shared/map'
import { Button, LeftPanel, MoreMenu, PanelTray, SplitLayout, WarningText } from '@/shared/ui'

/** 일정 편집 (디자인 10) · FUNC-003-06, 004-02, 06. 끌어서 순서 바꾸기는 기능 개발 때 dnd-kit으로 붙인다 */
export default function PlanEditPage() {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const [day, setDay] = useState(1)
  const [activeId, setActiveId] = useState<string | undefined>(editDemo.draggingId)
  const [title, setTitle] = useState(demoCourse.title)
  const items = editItems[day]
  const warnings = Object.values(editItems)
    .flat()
    .filter((i) => i.warning).length
  const otherDay = day === 1 ? 2 : 1

  return (
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-col gap-3.5 px-6 pt-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="뒤로"
                onClick={() => navigate(-1)}
                className="text-sub"
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
                onChange={setDay}
                detail={(d) => `${editItems[d.day].length}곳`}
              />
              <WarningText className="ml-auto text-[13px]">경고 {warnings}</WarningText>
            </div>
          </div>
          <ol className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 pt-3.5 pb-[100px]">
            {items.map((item, i) => {
              const active = item.id === activeId
              return (
                <li
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    'grid cursor-pointer grid-cols-[18px_28px_minmax(0,1fr)_28px] items-center gap-2.5 rounded-xl py-3 pr-3 pl-2 transition-transform',
                    active
                      ? 'translate-x-2 scale-[1.01] bg-sky-soft shadow-[0_0_0_1.5px_var(--color-sky),0_10px_24px_rgba(30,36,32,.16)]'
                      : item.warning
                        ? 'bg-warn-soft shadow-[inset_0_0_0_1px_#E3C68A]'
                        : 'bg-white shadow-[inset_0_0_0_1px_var(--color-line)]',
                  )}
                >
                  <GripVertical
                    size={14}
                    className="cursor-grab text-[#A3AAB0]"
                    aria-label="끌어서 순서 바꾸기"
                  />
                  <span
                    className="grid size-6 place-items-center rounded-full font-mono text-[11px] font-semibold text-white"
                    style={{ background: dayColor(day) }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-[3px]">
                    <span className="text-[15px] font-semibold">{item.name}</span>
                    <span className="font-mono text-xs font-medium text-sub">{item.time}</span>
                    {item.warning && <WarningText>{item.warning}</WarningText>}
                  </span>
                  <MoreMenu
                    label={`${item.name} 메뉴`}
                    items={[
                      { label: `${otherDay}일차로 옮기기` },
                      { label: '체류 시간 바꾸기' },
                      { label: '메모 추가' },
                      { label: '삭제', danger: true },
                    ]}
                  />
                </li>
              )
            })}
            <li>
              <button
                type="button"
                className="mt-1 flex h-[46px] w-full items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-line-strong text-sm font-semibold text-sky-text"
              >
                <Plus size={14} strokeWidth={2.5} />
                장소 추가 (찜 · 검색 · 식사·숙소 추천)
              </button>
            </li>
          </ol>
          <PanelTray className="gap-2.5 pl-[18px]">
            <span className="flex-1 text-[13px] text-sub">
              저장 안 된 변경{' '}
              <span className="font-mono font-semibold text-ink">{editDemo.unsavedChanges}</span> ·
              경고가 있어도 저장할 수 있어요
            </span>
            <Button variant="secondary" size="sm" className="px-3.5" onClick={() => navigate(-1)}>
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
                modes: items.slice(1).map(() => 'temp' as const),
              },
            ]}
          />
          <MapPanel className="top-4 left-1/2 flex -translate-x-1/2 items-center gap-3.5 rounded-full bg-ink py-[7px] pr-[7px] pl-[18px] text-sm whitespace-nowrap text-white shadow-[0_4px_14px_rgba(30,36,32,.2)]">
            순서가 바뀌어 임시로 직선 연결했어요
            <button type="button" className="rounded-full bg-sky px-3.5 py-[7px] font-semibold">
              경로 다시 계산
            </button>
          </MapPanel>
        </>
      }
    />
  )
}
