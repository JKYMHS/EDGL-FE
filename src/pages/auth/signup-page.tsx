import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { emailVerifyDemo, demoUser, terms } from '@/mocks/data/member'
import { cn } from '@/shared/lib/cn'
import { SignupAccountStep } from './signup-account-step'
import { Button, Checkbox, NamedStepHeader, StepHeading, StepLayout } from '@/shared/ui'

const STEPS = ['이메일 · 비밀번호', '이메일 인증', '약관 동의', '취향 입력']

/** 회원가입 4단계 (시안 A-1, 디자인 02 이메일 인증, 02-2 약관 동의) · FUNC-001-05~08 */
export default function SignupPage() {
  const [params, setParams] = useSearchParams()
  const step = Math.min(Math.max(Number(params.get('step')) || 1, 1), 3)
  const goTo = (n: number) => setParams({ step: String(n) })

  const header = (
    <NamedStepHeader
      steps={STEPS}
      current={step}
      action={
        <span className="text-sm whitespace-nowrap text-sub">
          이미 계정이 있나요?{' '}
          <Link to="/login" className="font-semibold text-sky-text">
            로그인
          </Link>
        </span>
      }
    />
  )

  if (step === 1) return <SignupAccountStep header={header} onNext={() => goTo(2)} />
  if (step === 2) return <EmailVerifyStep header={header} onNext={() => goTo(3)} />
  return <TermsStep header={header} onPrev={() => goTo(2)} />
}

function EmailVerifyStep({ header, onNext }: { header: ReactNode; onNext: () => void }) {
  const [code, setCode] = useState(emailVerifyDemo.digits.join(''))
  const complete = code.length === 6

  return (
    <StepLayout header={header} bodyClassName="gap-8 pt-24">
      <StepHeading
        current={2}
        total={4}
        align="center"
        title="메일로 받은 6자리 코드를 입력하세요"
        description={
          <>
            <strong className="font-semibold text-ink">{demoUser.email}</strong>으로 보냈어요 ·{' '}
            <button type="button" className="font-semibold text-sky-text">
              이메일 바꾸기
            </button>
          </>
        }
      />
      <label className="relative grid grid-cols-6 gap-3.5">
        <span className="sr-only">인증 코드 6자리</span>
        <input
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="peer absolute inset-0 opacity-0"
        />
        {Array.from({ length: 6 }, (_, i) => {
          const current = i === code.length
          return (
            <span
              key={i}
              aria-hidden
              className={cn(
                'grid h-[104px] place-items-center rounded-2xl border border-line font-mono text-[44px] font-bold',
                current &&
                  'peer-focus:border-[1.5px] peer-focus:border-sky peer-focus:shadow-[0_0_0_5px_var(--color-sky-soft)]',
              )}
            >
              {code[i] ?? (current && <span className="h-11 w-0.5 animate-pulse bg-sky" />)}
            </span>
          )
        })}
      </label>
      <div className="flex justify-between text-[15px]">
        <span className="text-sub">
          남은 시간{' '}
          <span className="font-mono font-semibold text-ink">{emailVerifyDemo.remaining}</span>
        </span>
        <button type="button" disabled className="font-semibold text-[#A3AAB0]">
          코드 다시 받기 <span className="font-mono">({emailVerifyDemo.resendIn}초)</span>
        </button>
      </div>
      <Button size="xl" className="h-14" disabled={!complete} onClick={onNext}>
        확인
      </Button>
      <p className="text-center text-sm leading-normal text-sub">
        메일이 안 왔다면 스팸함을 확인해 주세요. 5회 틀리면 새 코드를 받아야 해요.
      </p>
    </StepLayout>
  )
}

function TermsStep({ header, onPrev }: { header: ReactNode; onPrev: () => void }) {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(terms.map((t) => t.id))
  const required = terms.filter((t) => t.required)
  const optional = terms.filter((t) => !t.required)
  const count = (list: typeof terms) => list.filter((t) => agreed.includes(t.id)).length
  const allAgreed = agreed.length === terms.length
  const requiredOk = count(required) === required.length
  const toggle = (id: string) =>
    setAgreed((list) => (list.includes(id) ? list.filter((v) => v !== id) : [...list, id]))

  return (
    <StepLayout
      header={header}
      bodyClassName="gap-6"
      tray={
        <>
          <Button variant="secondary" onClick={onPrev} className="px-4">
            이전
          </Button>
          <span className="flex-1 text-[13px] text-sub">
            필수{' '}
            <span className="font-mono font-semibold text-ink">
              {count(required)}/{required.length}
            </span>{' '}
            · 선택{' '}
            <span className="font-mono font-semibold text-ink">
              {count(optional)}/{optional.length}
            </span>
          </span>
          <Button
            disabled={!requiredOk}
            onClick={() => navigate('/onboarding')}
            className="px-[22px]"
          >
            동의하고 가입하기
          </Button>
        </>
      }
    >
      <StepHeading
        current={3}
        total={4}
        title="약관에 동의해 주세요"
        description="필수 항목에 동의해야 가입할 수 있어요. 선택 항목은 나중에 마이페이지에서 바꿀 수 있어요."
      />
      <label
        className={cn(
          'grid cursor-pointer grid-cols-[28px_minmax(0,1fr)] items-center gap-3.5 rounded-[14px] p-5',
          allAgreed
            ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
            : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
        )}
      >
        <Checkbox
          size="lg"
          checked={allAgreed}
          onCheckedChange={(on) => setAgreed(on ? terms.map((t) => t.id) : [])}
          label="전체 동의"
        />
        <span className="flex flex-col gap-[3px]">
          <span className="text-lg font-bold">전체 동의</span>
          <span className="text-[13px] text-sub">
            필수 {required.length}개와 선택 {optional.length}개에 모두 동의해요
          </span>
        </span>
      </label>
      <ul className="flex flex-col">
        {terms.map((t) => (
          <li
            key={t.id}
            className="grid grid-cols-[28px_52px_minmax(0,1fr)_auto] items-center gap-3 border-b border-surface px-5 py-3.5"
          >
            <Checkbox
              checked={agreed.includes(t.id)}
              onCheckedChange={() => toggle(t.id)}
              label={t.name}
            />
            <span
              className={cn(
                'justify-self-start rounded-md px-2 py-0.5 text-xs font-bold whitespace-nowrap',
                t.required ? 'bg-sky-soft text-sky-text' : 'bg-field text-sub',
              )}
            >
              {t.required ? '필수' : '선택'}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">{t.name}</span>
              {t.description && <span className="text-[13px] text-sub">{t.description}</span>}
            </span>
            <button type="button" className="text-[13px] font-semibold whitespace-nowrap text-sub">
              보기 ›
            </button>
          </li>
        ))}
      </ul>
      <p className="text-[13px] leading-normal text-sub">
        만 14세 미만은 가입할 수 없어요. 위치 정보는 출발지·주변 장소 추천에만 쓰이고, 추천이 끝나면
        저장하지 않아요.
      </p>
    </StepLayout>
  )
}
