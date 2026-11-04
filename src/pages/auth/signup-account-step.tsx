import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { GoogleButton, PasswordField, isValidEmail, isValidPassword } from '@/features/auth'
import { signupDemo, takenEmails } from '@/mocks/data/member'
import { Button, StepHeading, TextField } from '@/shared/ui'

/** 회원가입 1단계 — 이메일·비밀번호 (시안 A-1) · FUNC-001-07 */
export function SignupAccountStep({ header, onNext }: { header: ReactNode; onNext: () => void }) {
  const [email, setEmail] = useState(signupDemo.email)
  const [password, setPassword] = useState(signupDemo.password)
  const [confirm, setConfirm] = useState('')

  const taken = takenEmails.includes(email.trim())
  const emailError = taken ? (
    <>
      이미 가입된 이메일이에요.{' '}
      <Link to="/login" className="font-semibold text-sky-text">
        로그인
      </Link>{' '}
      또는{' '}
      <Link to="/password/reset" className="font-semibold text-sky-text">
        비밀번호 찾기
      </Link>
    </>
  ) : email && !isValidEmail(email) ? (
    '이메일 형식이 아니에요'
  ) : undefined
  const confirmError = confirm && confirm !== password ? '비밀번호가 같지 않아요' : undefined
  const canSubmit =
    isValidEmail(email) && !taken && isValidPassword(password) && confirm === password

  return (
    <div className="flex h-full min-h-[720px] flex-col">
      {header}
      <main className="flex flex-1 justify-center overflow-y-auto pt-[72px] pb-16">
        <form
          className="flex w-[440px] flex-col gap-[22px]"
          onSubmit={(e) => {
            e.preventDefault()
            if (canSubmit) onNext()
          }}
        >
          <StepHeading
            current={1}
            total={4}
            title="계정을 만들어요"
            description="로그인할 때 쓸 이메일과 비밀번호를 정해 주세요."
          />
          <TextField
            label="이메일"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <PasswordField label="비밀번호" value={password} onChange={setPassword} showRules />
          <PasswordField
            label="비밀번호 확인"
            value={confirm}
            onChange={setConfirm}
            matchWith={password}
            placeholder="한 번 더 입력"
            error={confirmError}
          />
          <Button type="submit" size="xl" disabled={!canSubmit}>
            인증 메일 받기
          </Button>
          <div className="flex items-center gap-3 text-[13px] text-muted">
            <span className="h-px flex-1 bg-line" />
            또는
            <span className="h-px flex-1 bg-line" />
          </div>
          <GoogleButton label="Google로 가입하기" />
        </form>
      </main>
    </div>
  )
}
