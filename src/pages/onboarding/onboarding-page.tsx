import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { STYLE_PICK_MAX } from '@/features/onboarding/model/types'
import { defaultStyleIds, travelStyles } from '@/mocks/data/member'
import {
  Button,
  CheckMark,
  NotDesigned,
  OptionCard,
  Pill,
  ProgressStepHeader,
  StepHeading,
  StepLayout,
} from '@/shared/ui'

const TOTAL = 5
const LATER_STEPS = ['페이스', '선호 시간대', '이동 편의', '반려동물']

/** 온보딩 취향 입력 5단계 (디자인 03은 1단계만) · FUNC-001-13 */
export default function OnboardingPage() {
  const [params, setParams] = useSearchParams()
  const step = Math.min(Math.max(Number(params.get('step')) || 1, 1), TOTAL)
  const [styleIds, setStyleIds] = useState(defaultStyleIds)

  const toggle = (id: string) =>
    setStyleIds((list) => {
      if (list.includes(id)) return list.filter((v) => v !== id)
      return list.length >= STYLE_PICK_MAX ? list : [...list, id]
    })
  const picked = styleIds.flatMap((id) => travelStyles.find((s) => s.id === id) ?? [])

  const header = (
    <ProgressStepHeader
      total={TOTAL}
      current={step}
      action={
        <Link to="/explore" className="text-sm font-semibold text-sub hover:text-ink">
          나중에 하기
        </Link>
      }
    />
  )

  if (step > 1) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <NotDesigned name={`온보딩 ${step}단계 — ${LATER_STEPS[step - 2]}`} />
        <div className="flex justify-center gap-2 pb-10">
          <Button variant="secondary" onClick={() => setParams({ step: String(step - 1) })}>
            이전
          </Button>
          {step < TOTAL && (
            <Button onClick={() => setParams({ step: String(step + 1) })}>다음</Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <StepLayout
      header={header}
      bodyClassName="gap-8 pt-[72px]"
      trayClassName="pl-5"
      tray={
        <>
          <span className="text-sm font-semibold whitespace-nowrap">
            선택 <span className="font-mono">{picked.length}</span>
          </span>
          <div className="flex min-w-0 flex-1 gap-1.5">
            {picked.map((s) => (
              <Pill key={s.id}>{s.name}</Pill>
            ))}
          </div>
          <Button disabled={picked.length === 0} onClick={() => setParams({ step: '2' })}>
            다음
          </Button>
        </>
      }
    >
      <StepHeading
        current={1}
        total={TOTAL}
        title="어떤 여행을 좋아하세요?"
        description="1~3개 골라 주세요. 추천 코스의 장소 구성에 반영돼요."
      />
      <div className="grid grid-cols-2 gap-2.5">
        {travelStyles.map((s) => {
          const on = styleIds.includes(s.id)
          return (
            <OptionCard
              key={s.id}
              selected={on}
              onClick={() => toggle(s.id)}
              className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-3.5 p-[18px]"
            >
              <CheckMark checked={on} />
              <span className="flex flex-col gap-[3px]">
                <span className="text-[17px] font-semibold">{s.name}</span>
                <span className="text-sm text-sub">{s.description}</span>
              </span>
            </OptionCard>
          )
        })}
      </div>
    </StepLayout>
  )
}
