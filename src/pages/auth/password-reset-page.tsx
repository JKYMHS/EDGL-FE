import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { CodeInput, PasswordField, isValidEmail, isValidPassword } from '@/features/auth'
import { passwordResetDemo } from '@/mocks/data/member'
import { Button, NamedStepHeader, TextField } from '@/shared/ui'

const STEPS = ['이메일 인증', '새 비밀번호']

/** 비밀번호 찾기 2단계 (시안 A-2, A-3) · FUNC-001-09, 001-06 */
export default function PasswordResetPage() {
  const [params, setParams] = useSearchParams()
  const step = params.get('step') === '2' ? 2 : 1

  return (
    <div className="flex h-full min-h-[720px] flex-col">
      <NamedStepHeader
        steps={STEPS}
        current={step}
        action={
          <Link
            to="/login"
            className="text-sm font-semibold whitespace-nowrap text-sub hover:text-ink"
          >
            로그인으로 돌아가기
          </Link>
        }
      />
      <main className="flex flex-1 justify-center overflow-y-auto pt-24 pb-16">
        {step === 1 ? <VerifyStep onNext={() => setParams({ step: '2' })} /> : <NewPasswordStep />}
      </main>
    </div>
  )
}

function VerifyStep({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState(passwordResetDemo.email)
  const [code, setCode] = useState(passwordResetDemo.code)
  // 예시: 처음 입력한 코드는 틀린 상태 (VERIFICATION_CODE_MISMATCH)
  const mismatch = code === passwordResetDemo.code

  return (
    <form
      className="flex w-[440px] flex-col gap-[22px]"
      onSubmit={(e) => {
        e.preventDefault()
        if (code.length === 6 && !mismatch) onNext()
      }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-bold tracking-[-0.02em]">비밀번호를 잊으셨나요?</h1>
        <p className="text-base text-sub">가입한 이메일로 6자리 코드를 보내 드려요.</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="secondary"
            disabled
            className="h-12 shadow-[inset_0_0_0_1px_var(--color-line)]"
          >
            다시 받기{' '}
            <span className="font-mono text-[13px]">({passwordResetDemo.resendIn}초)</span>
          </Button>
        </div>
        {isValidEmail(email) && (
          <p className="text-[13px] text-sub">
            코드를 보냈어요. 메일이 안 왔다면 스팸함을 확인해 주세요.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">인증 코드</span>
          <span className="text-[13px] text-sub">
            남은 시간 <b className="font-mono text-ink">{passwordResetDemo.remaining}</b>
          </span>
        </div>
        <CodeInput value={code} onChange={setCode} error={mismatch} />
        {mismatch && (
          <p className="text-[13px] text-error">
            코드가 맞지 않아요. {passwordResetDemo.attemptsLeft}번 더 입력할 수 있어요.
          </p>
        )}
      </div>
      <Button type="submit" size="xl" disabled={code.length < 6}>
        확인
      </Button>
    </form>
  )
}

function NewPasswordStep() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const ok = isValidPassword(password) && password === confirm

  return (
    <form
      className="flex w-[440px] flex-col gap-[22px]"
      onSubmit={(e) => {
        e.preventDefault()
        if (ok) navigate('/login?reset=done')
      }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-bold tracking-[-0.02em]">새 비밀번호를 정해 주세요</h1>
        <p className="text-base text-sub">
          <b className="text-ink">{passwordResetDemo.email}</b> 계정이에요.
        </p>
      </div>
      <PasswordField label="새 비밀번호" value={password} onChange={setPassword} showRules />
      <PasswordField
        label="새 비밀번호 확인"
        value={confirm}
        onChange={setConfirm}
        matchWith={password}
        placeholder="한 번 더 입력"
        error={confirm && confirm !== password ? '비밀번호가 같지 않아요' : undefined}
      />
      <p className="rounded-xl bg-[#F8FAFB] px-4 py-3.5 text-[13px] leading-normal text-sub">
        바꾸면 로그인된 모든 기기에서 로그아웃되고, 로그인 잠금도 풀려요.
      </p>
      <Button type="submit" size="xl" disabled={!ok}>
        비밀번호 바꾸기
      </Button>
    </form>
  )
}
