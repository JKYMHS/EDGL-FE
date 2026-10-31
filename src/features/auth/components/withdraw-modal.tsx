import { useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button, Checkbox, Modal } from '@/shared/ui'
import { PasswordField } from './password-field'

type Row = { label: string; value: string; mono?: boolean }

const STEPS = ['안내', '본인 확인', '최종 확인']

/** 회원 탈퇴 3단계: 삭제 데이터 안내 → 본인 확인 → 최종 확인 (시안 C-5) · FUNC-001-12 */
export function WithdrawModal({
  open,
  onOpenChange,
  summary,
  onWithdraw,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: Row[]
  onWithdraw: () => void
}) {
  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [password, setPassword] = useState('')

  const titles = ['탈퇴하면 이렇게 돼요', '본인 확인을 할게요', '정말 탈퇴할까요?']

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setStep(1)
      }}
      title={
        <>
          <span className="mb-3 flex gap-2 font-mono text-xs font-semibold text-sub">
            {STEPS.map((s, i) => (
              <span key={s} className={cn(i + 1 === step && 'text-sky-text')}>
                {i > 0 && '→ '}
                {i + 1} {s}
              </span>
            ))}
          </span>
          {titles[step - 1]}
        </>
      }
      description={
        step === 3 ? '탈퇴하면 같은 이메일로 다시 가입해도 데이터를 되살릴 수 없어요.' : undefined
      }
      className="w-[560px] gap-[18px] rounded-[20px]"
    >
      {step === 1 && (
        <>
          <dl className="flex flex-col border-t border-surface">
            {summary.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-surface py-[11px] text-sm"
              >
                <dt>{row.label}</dt>
                <dd className={cn('text-sub', row.mono ? 'font-mono' : 'text-[13px]')}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="rounded-xl bg-warn-soft px-4 py-3.5 text-sm leading-normal text-[#6B4A00] shadow-[inset_0_0_0_1px_#E3C68A]">
            삭제한 데이터는 되돌릴 수 없어요. 캘린더 일정 일부를 지우지 못해도 탈퇴는 진행돼요.
          </p>
          <label className="flex items-center gap-3 text-sm">
            <Checkbox
              size="sm"
              checked={agreed}
              onCheckedChange={setAgreed}
              label="위 내용을 확인했어요"
            />
            위 내용을 확인했어요
          </label>
        </>
      )}
      {step === 2 && (
        <PasswordField
          label="비밀번호"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
      )}
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={() => (step === 1 ? onOpenChange(false) : setStep(step - 1))}
        >
          {step === 1 ? '취소' : '이전'}
        </Button>
        {step < 3 ? (
          <Button
            variant="danger"
            disabled={step === 1 ? !agreed : !password}
            onClick={() => setStep(step + 1)}
          >
            다음: {STEPS[step]}
          </Button>
        ) : (
          <Button variant="danger" onClick={onWithdraw}>
            탈퇴하기
          </Button>
        )}
      </div>
    </Modal>
  )
}
