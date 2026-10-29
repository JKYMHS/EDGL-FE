import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  CompanionStep,
  DepartureStep,
  MustVisitStep,
  PeriodStep,
  RegionStep,
  type RecommendDraft,
} from '@/features/recommend'
import {
  MUST_VISIT_LIMIT,
  calendarMonth,
  calendarPastBefore,
  calendarWeeks,
  companionOptions,
  departureResults,
  districtOptions,
  initialDraft,
  moreDistrictCount,
  mustVisitCandidates,
  recentDepartures,
  recommendQuota,
  regionOptions,
  startTimeOptions,
} from '@/mocks/data/recommend'
import { formatShortRange, tripLengthLabel } from '@/shared/lib/date'
import { Button, Pill, ProgressStepHeader, StepHeading, StepLayout } from '@/shared/ui'

const TOTAL = 5

const HEADINGS: Record<number, { title: string; description: string }> = {
  1: { title: '어디로 갈까요?', description: '시·도를 고르고, 원하면 구·군까지 좁혀 주세요.' },
  2: {
    title: '언제 떠나세요?',
    description: '가는 날과 오는 날을 눌러 주세요. 최대 3박 4일까지 짤 수 있어요.',
  },
  3: { title: '어디서 출발하세요?', description: '첫 장소까지의 이동 시간을 계산할 때 써요.' },
  4: {
    title: '누구와 가세요?',
    description: '동행에 맞춰 걷는 거리, 쉬는 시간, 장소 종류를 조절해요.',
  },
  5: {
    title: '꼭 가고 싶은 곳이 있나요?',
    description: '선택 사항이에요. 최대 5곳까지 코스에 반드시 넣어 드려요.',
  },
}

function readStep(value: string | null) {
  const n = Number(value)
  return Number.isInteger(n) && n >= 1 && n <= TOTAL ? n : 1
}

/** 추천 요청 5단계 (디자인 07-1 ~ 07-5) · FUNC-002-07, 003-01 */
export default function RecommendRequestPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const step = readStep(params.get('step'))
  const [draft, setDraft] = useState<RecommendDraft>(initialDraft)
  const [departureQuery, setDepartureQuery] = useState('서울역')

  const update = (patch: Partial<RecommendDraft>) => setDraft((d) => ({ ...d, ...patch }))
  const goTo = (n: number) => setParams({ step: String(n) })

  const region = regionOptions.find((r) => r.id === draft.regionId)
  const departure = departureResults.find((d) => d.id === draft.departureId)
  const companion = companionOptions.find((c) => c.id === draft.companionId)
  const regionLabel = [region?.name, draft.districts.join(', ')].filter(Boolean).join(' · ')
  const length = draft.start && draft.end ? tripLengthLabel(draft.start, draft.end) : undefined
  const canNext = step !== 2 || Boolean(draft.start && draft.end)

  // 트레이에는 지금까지 고른 값을 칩으로 모은다 (디자인 07 트레이)
  const chips: ReactNode[] = []
  if (step === 1 || step === 2 || step === 3) chips.push(regionLabel)
  if (step >= 4) chips.push(region?.name)
  if (step === 2 && draft.start && draft.end) {
    chips.push(
      <>
        <span className="font-mono">{formatShortRange(draft.start, draft.end)}</span> · {length} ·{' '}
        <span className="font-mono">{draft.startTime === 'custom' ? '직접' : draft.startTime}</span>
      </>,
    )
  }
  if (step >= 3 && length) chips.push(length)
  if (step >= 3 && departure) chips.push(`${departure.name} 출발`)
  if (step >= 4 && companion) chips.push(companion.name)

  return (
    <StepLayout
      header={
        <ProgressStepHeader
          total={TOTAL}
          current={step}
          badge={
            <span className="rounded-full bg-sky-soft px-2.5 py-[5px] text-[13px] font-semibold text-sky-text">
              AI 코스 추천
            </span>
          }
          action={
            <Link to="/explore" className="text-sm font-semibold text-sub hover:text-ink">
              취소
            </Link>
          }
        />
      }
      trayClassName={step === 1 ? 'pl-5' : undefined}
      tray={
        <>
          {step > 1 && (
            <Button variant="secondary" onClick={() => goTo(step - 1)} className="px-4">
              이전
            </Button>
          )}
          {step < 5 ? (
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-hidden">
              {chips.map((chip, i) => (
                <Pill key={i}>{chip}</Pill>
              ))}
            </div>
          ) : (
            <>
              <span className="flex-1 text-[13px] text-sub">
                {[region?.name, length, departure?.name, companion?.name].join(' · ')} · 장소{' '}
                <span className="font-mono text-ink">{draft.mustVisitIds.length}</span>
              </span>
              <span className="text-[13px] text-sub">
                남은 추천{' '}
                <span className="font-mono font-semibold text-ink">
                  {recommendQuota.left}/{recommendQuota.total}
                </span>
              </span>
            </>
          )}
          {step < 5 ? (
            <Button disabled={!canNext} onClick={() => goTo(step + 1)} className="px-[22px]">
              다음
            </Button>
          ) : (
            <Button onClick={() => navigate('/recommend/r-demo?status=pending')}>
              코스 추천받기
            </Button>
          )}
        </>
      }
    >
      <StepHeading
        current={step}
        total={TOTAL}
        title={HEADINGS[step].title}
        description={HEADINGS[step].description}
        aside={
          step === 5 && (
            <button
              type="button"
              onClick={() => navigate('/recommend/r-demo?status=pending')}
              className="text-sm font-semibold text-sub hover:text-ink"
            >
              건너뛰기
            </button>
          )
        }
      />
      {step === 1 && (
        <RegionStep
          regions={regionOptions}
          districts={districtOptions}
          moreDistrictCount={moreDistrictCount}
          regionId={draft.regionId}
          selectedDistricts={draft.districts}
          onRegionChange={(regionId) => update({ regionId, districts: [] })}
          onDistrictsChange={(districts) => update({ districts })}
        />
      )}
      {step === 2 && (
        <PeriodStep
          year={calendarMonth.year}
          month={calendarMonth.month}
          weeks={calendarWeeks}
          pastBefore={calendarPastBefore}
          start={draft.start}
          end={draft.end}
          startTime={draft.startTime}
          startTimeOptions={startTimeOptions}
          preferenceLabel="오전"
          onRangeChange={(range) => update(range)}
          onStartTimeChange={(startTime) => update({ startTime })}
        />
      )}
      {step === 3 && (
        <DepartureStep
          query={departureQuery}
          results={departureQuery ? departureResults : []}
          recent={recentDepartures}
          selectedId={draft.departureId}
          onQueryChange={setDepartureQuery}
          onSelect={(departureId) => update({ departureId })}
        />
      )}
      {step === 4 && (
        <CompanionStep
          options={companionOptions}
          companionId={draft.companionId}
          indoor={draft.indoor}
          onCompanionChange={(companionId) => update({ companionId })}
          onIndoorChange={(indoor) => update({ indoor })}
        />
      )}
      {step === 5 && (
        <MustVisitStep
          candidates={mustVisitCandidates}
          selectedIds={draft.mustVisitIds}
          limit={MUST_VISIT_LIMIT}
          onChange={(mustVisitIds) => update({ mustVisitIds })}
        />
      )}
    </StepLayout>
  )
}
