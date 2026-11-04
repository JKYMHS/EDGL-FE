import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { CourseMap, CourseTimeline, DayTabs, SaveTripModal, type CourseStop } from '@/features/trip'
import { demoCourse as course, demoCourseFocus, retryQuota, trips } from '@/mocks/data/course'
import { MapPanel, MapPin, RouteLegend, type RouteMode } from '@/shared/map'
import { Button, LeftPanel, PanelTray, SplitLayout } from '@/shared/ui'
import { GeneratingView } from './generating-view'

function modesOf(day: number): RouteMode[] {
  return course.timeline[day].flatMap((item) => (item.kind === 'move' ? [item.mode] : []))
}

/** AI 생성 중 (08) · 추천 결과 (09) · 저장 위치 모달 (11-4) · FUNC-003-02~06, 10, 004-07, 08 */
export default function RecommendResultPage() {
  const [params, setParams] = useSearchParams()
  const pending = params.get('status') === 'pending'
  const showDone = useCallback(() => setParams({}, { replace: true }), [setParams])

  if (pending) return <GeneratingView conditions={course.conditions} onDone={showDone} />
  return <ResultView initialSaveOpen={params.get('modal') === 'save'} />
}

function ResultView({ initialSaveOpen }: { initialSaveOpen: boolean }) {
  const navigate = useNavigate()
  const [day, setDay] = useState(demoCourseFocus.day)
  const [focusedId, setFocusedId] = useState<string | undefined>('c3')
  const [saveOpen, setSaveOpen] = useState(initialSaveOpen)

  const stops = course.timeline[day].filter((item): item is CourseStop => item.kind === 'place')
  const focused = stops.find((s) => s.id === focusedId)

  return (
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-col gap-3.5 px-6 pt-5">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-sub">{course.conditions}</span>
                <h1 className="text-[22px] font-bold tracking-[-0.01em]">{course.title}</h1>
              </div>
              <span className="text-[13px] text-sub">
                {course.summary.places}곳 · 이동{' '}
                <span className="font-mono text-ink">{course.summary.moveTime}</span>
              </span>
            </div>
            <DayTabs
              days={course.days}
              value={day}
              onChange={(d) => {
                setDay(d)
                setFocusedId(undefined)
              }}
              className="border-b border-line"
            />
          </div>
          <div className="flex-1 overflow-y-auto px-3 pt-2 pb-[100px]">
            <CourseTimeline
              day={day}
              items={course.timeline[day]}
              focusedId={focusedId}
              onFocus={setFocusedId}
            />
          </div>
          <PanelTray className="gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-auto min-h-10 flex-col gap-0 px-3.5 py-1 leading-tight"
            >
              다시 추천
              <span className="font-mono text-xs text-sub">
                {retryQuota.used}/{retryQuota.total}
              </span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="px-3.5"
              onClick={() => navigate('/trips/t-palace/plans/p-basic/edit')}
            >
              편집하기
            </Button>
            <span className="flex-1" />
            <Button size="sm" className="px-[18px]" onClick={() => setSaveOpen(true)}>
              여행에 저장
            </Button>
          </PanelTray>
        </LeftPanel>
      }
      right={
        <>
          <CourseMap
            activeDay={day}
            focus={focused ? { day, n: focused.n } : undefined}
            routes={course.days.map((d) => ({
              day: d.day,
              points: course.points[d.day],
              modes: modesOf(d.day),
            }))}
          >
            {focused && day === demoCourseFocus.day && focused.n === demoCourseFocus.n && (
              <MapPin point={focused.point} anchor="bottom" z={20} className="-mt-[26px]">
                <div className="flex w-[260px] flex-col gap-1 rounded-[14px] bg-white p-3.5 shadow-[0_10px_28px_rgba(30,36,32,.2)]">
                  <span className="font-mono text-xs font-medium text-sub">
                    {demoCourseFocus.n} · {demoCourseFocus.time}
                  </span>
                  <span className="text-base font-bold">{demoCourseFocus.name}</span>
                  <span className="text-[13px] text-sub">다음: {demoCourseFocus.next}</span>
                </div>
              </MapPin>
            )}
          </CourseMap>
          <MapPanel className="top-4 left-4 rounded-[10px] px-3.5 py-3">
            <RouteLegend />
          </MapPanel>
          <SaveTripModal
            open={saveOpen}
            onOpenChange={setSaveOpen}
            courseLabel={`고궁과 정동 야행 · 1박 2일 · ${course.summary.places}곳`}
            trips={trips.filter((t) => t.group === 'upcoming')}
            matchedTripId="t-palace"
            defaultPlanName="AI 추천 · 10.19"
            confirmedPlanName="기본 코스"
            onSave={() => navigate('/trips/t-palace')}
          />
        </>
      }
    />
  )
}
