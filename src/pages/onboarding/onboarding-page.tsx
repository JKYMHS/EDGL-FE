import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  PACE_OPTIONS,
  TIME_OPTIONS,
  type OnboardingAnswers,
} from '@/features/onboarding/model/options'
import { STYLE_PICK_MAX } from '@/features/onboarding/model/types'
import { defaultStyleIds, travelStyles } from '@/mocks/data/member'
import { cn } from '@/shared/lib/cn'
import {
  Button,
  CheckMark,
  OptionCard,
  Pill,
  ProgressStepHeader,
  RadioMark,
  StepHeading,
  StepLayout,
  Toggle,
} from '@/shared/ui'

const TOTAL = 5

const HEADINGS: Record<number, { title: string; description: string }> = {
  1: {
    title: '어떤 여행을 좋아하세요?',
    description: '1~3개 골라 주세요. 추천 코스의 장소 구성에 반영돼요.',
  },
  2: {
    title: '하루에 몇 곳쯤 다닐까요?',
    description: '추천 코스의 장소 수와 체류 시간에 반영돼요.',
  },
  3: {
    title: '여행 첫 일정은 언제 시작할까요?',
    description: 'AI 추천을 요청할 때 첫날 시작 시간의 기본값이 돼요. 그때그때 바꿀 수 있어요.',
  },
  4: {
    title: '이동이 편한 길이 필요하세요?',
    description: '유모차·휠체어와 함께하거나 오래 걷기 어려울 때 켜 주세요.',
  },
  5: {
    title: '반려동물과 함께 다니세요?',
    description: '켜면 반려동물 동반이 되는 곳만 추천해요.',
  },
}

/** 온보딩 취향 입력 5단계 (디자인 03, 시안 B-1~B-4) · FUNC-001-13 */
export default function OnboardingPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const step = Math.min(Math.max(Number(params.get('step')) || 1, 1), TOTAL)
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    styleIds: defaultStyleIds,
    pace: 'packed',
    timeOfDay: 'morning',
    accessible: false,
    pet: false,
  })
  const update = (patch: Partial<OnboardingAnswers>) => setAnswers((a) => ({ ...a, ...patch }))
  const goTo = (n: number) => setParams({ step: String(n) })

  const toggleStyle = (id: string) => {
    const list = answers.styleIds
    if (list.includes(id)) return update({ styleIds: list.filter((v) => v !== id) })
    if (list.length < STYLE_PICK_MAX) update({ styleIds: [...list, id] })
  }
  const styles = answers.styleIds.flatMap((id) => travelStyles.find((s) => s.id === id) ?? [])
  const pace = PACE_OPTIONS.find((p) => p.value === answers.pace)!
  const time = TIME_OPTIONS.find((t) => t.value === answers.timeOfDay)!

  // 트레이에는 지금까지 고른 값을 칩으로 모은다
  const chips: ReactNode[] = []
  if (step === 1) styles.forEach((s) => chips.push(s.name))
  if (step >= 2 && step <= 3) chips.push(styles.map((s) => s.name).join(' · '))
  if (step >= 2) chips.push(pace.name)
  if (step >= 3)
    chips.push(
      <>
        {time.name} <span className="font-mono">{time.time}</span>
      </>,
    )
  if (step >= 4 && answers.accessible) chips.push('이동 편의')

  return (
    <StepLayout
      header={
        <ProgressStepHeader
          total={TOTAL}
          current={step}
          action={
            <Link to="/explore" className="text-sm font-semibold text-sub hover:text-ink">
              나중에 하기
            </Link>
          }
        />
      }
      bodyClassName="gap-8 pt-[72px]"
      trayClassName={step === 1 ? 'pl-5' : undefined}
      tray={
        <>
          {step > 1 && (
            <Button variant="secondary" onClick={() => goTo(step - 1)} className="px-4">
              이전
            </Button>
          )}
          {step === 1 && (
            <span className="text-sm font-semibold whitespace-nowrap">
              선택 <span className="font-mono">{styles.length}</span>
            </span>
          )}
          {step < TOTAL ? (
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-hidden">
              {chips.map((chip, i) => (
                <Pill key={i}>{chip}</Pill>
              ))}
            </div>
          ) : (
            <span className="flex-1 text-[13px] text-sub">
              다 됐어요. 이제 축제와 관광지를 둘러보세요
            </span>
          )}
          {step < TOTAL ? (
            <Button disabled={styles.length === 0} onClick={() => goTo(step + 1)}>
              다음
            </Button>
          ) : (
            <Button onClick={() => navigate('/')}>시작하기</Button>
          )}
        </>
      }
    >
      <StepHeading
        current={step}
        total={TOTAL}
        title={HEADINGS[step].title}
        description={HEADINGS[step].description}
      />

      {step === 1 && (
        <div className="grid grid-cols-2 gap-2.5">
          {travelStyles.map((s) => {
            const on = answers.styleIds.includes(s.id)
            return (
              <OptionCard
                key={s.id}
                selected={on}
                onClick={() => toggleStyle(s.id)}
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
      )}

      {step === 2 && (
        <div role="radiogroup" aria-label="페이스" className="grid grid-cols-2 gap-2.5">
          {PACE_OPTIONS.map((p) => {
            const on = p.value === answers.pace
            return (
              <OptionCard
                key={p.value}
                role="radio"
                aria-checked={on}
                selected={on}
                onClick={() => update({ pace: p.value })}
                className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3.5 px-[22px] py-6"
              >
                <RadioMark checked={on} />
                <span className="flex flex-col gap-[3px]">
                  <span className="text-[17px] font-semibold">{p.name}</span>
                  <span className="text-sm text-sub">
                    하루 <b className="font-mono text-ink">{p.range}</b>곳, {p.description}
                  </span>
                  <span aria-hidden className="mt-4 flex gap-1.5">
                    {Array.from({ length: p.bars }, (_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-2 rounded',
                          on ? 'bg-sky' : 'bg-line-strong',
                          p.bars === 3 ? 'w-[60px]' : 'w-[34px]',
                        )}
                      />
                    ))}
                  </span>
                </span>
              </OptionCard>
            )
          })}
        </div>
      )}

      {step === 3 && (
        <div role="radiogroup" aria-label="선호 시간대" className="grid grid-cols-3 gap-2.5">
          {TIME_OPTIONS.map((t) => {
            const on = t.value === answers.timeOfDay
            return (
              <OptionCard
                key={t.value}
                role="radio"
                aria-checked={on}
                selected={on}
                onClick={() => update({ timeOfDay: t.value })}
                className="flex flex-col p-[22px]"
              >
                <span className="flex items-center justify-between">
                  <span className="text-[17px] font-semibold">{t.name}</span>
                  <RadioMark checked={on} />
                </span>
                <span className="mt-2.5 font-mono text-[28px] font-semibold">{t.time}</span>
                <span className="mt-[3px] text-sm text-sub">{t.description}</span>
              </OptionCard>
            )
          })}
        </div>
      )}

      {step === 4 && (
        <>
          <ToggleCard
            title="계단이 적고 평탄한 길 위주로 짜기"
            description="경사가 심하거나 계단이 많은 곳은 뒤로 미루고, 걷는 거리를 줄여요"
            checked={answers.accessible}
            onChange={(accessible) => update({ accessible })}
          />
          <p className="rounded-xl bg-[#F8FAFB] px-4 py-3.5 text-[13px] leading-normal text-sub">
            장소마다 접근성 정보가 다르게 등록돼 있어서, 켜도 모든 곳이 완벽하게 평탄하지는 않을 수
            있어요.
          </p>
        </>
      )}

      {step === 5 && (
        <>
          <ToggleCard
            title="반려동물과 함께 갈 수 있는 곳만 추천"
            description="동반 여부가 확인되지 않은 곳은 추천에서 빠져요"
            checked={answers.pet}
            onChange={(pet) => update({ pet })}
          />
          <section aria-label="고른 취향" className="rounded-xl bg-[#F8FAFB] px-4 py-3.5">
            <h2 className="mb-2.5 text-[13px] font-bold text-sub">이렇게 정했어요</h2>
            <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-sub">여행 스타일</dt>
              <dd>{styles.map((s) => s.name).join(', ')}</dd>
              <dt className="text-sub">페이스</dt>
              <dd>
                {pace.name} · {pace.range}곳
              </dd>
              <dt className="text-sub">시작 시간</dt>
              <dd>
                {time.name} <span className="font-mono">{time.time}</span>
              </dd>
              <dt className="text-sub">이동 편의</dt>
              <dd>{answers.accessible ? '켬' : '끔'}</dd>
            </dl>
            <p className="mt-3 text-xs text-muted">
              마이페이지 → 취향 설정에서 언제든 바꿀 수 있어요
            </p>
          </section>
        </>
      )}
    </StepLayout>
  )
}

/** 카드 전체를 눌러 켜고 끄는 토글 (시안 B-3, B-4) */
function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      className={cn(
        'grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 rounded-xl px-6 py-[22px]',
        checked
          ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
          : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
      )}
    >
      <span className="flex flex-col gap-[3px]">
        <span className="text-[17px] font-semibold">{title}</span>
        <span className="text-sm text-sub">{description}</span>
      </span>
      <Toggle checked={checked} onCheckedChange={onChange} label={title} />
    </label>
  )
}
