import { Check, Circle } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { TextField } from '@/shared/ui'
import { checkPassword } from '../model/password-policy'

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  /** 정책 체크 목록을 보여 줄지 (새 비밀번호 칸) */
  showRules?: boolean
  /** 확인 칸이면 비교할 값 */
  matchWith?: string
  error?: ReactNode
  placeholder?: string
  autoComplete?: string
}

/** 비밀번호 입력 + "보기" + 정책 실시간 표시 (A-1, A-3, C-3) */
export function PasswordField({
  label,
  value,
  onChange,
  showRules = false,
  matchWith,
  error,
  placeholder,
  autoComplete = 'new-password',
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const matched = matchWith !== undefined && value.length > 0 && value === matchWith

  return (
    <div className="flex flex-col gap-2">
      <TextField
        label={label}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={error}
        suffix={
          matched ? (
            <span className="text-[13px] font-semibold text-done">✓ 같아요</span>
          ) : (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="text-[13px] font-semibold text-sub"
            >
              {visible ? '숨기기' : '보기'}
            </button>
          )
        }
      />
      {showRules && (
        <ul aria-label="비밀번호 조건" className="flex flex-wrap gap-3.5 text-[13px]">
          {checkPassword(value).map((rule) => (
            <li
              key={rule.id}
              aria-label={`${rule.label} ${rule.ok ? '충족' : '미충족'}`}
              className={cn(
                'flex items-center gap-1',
                rule.ok ? 'font-semibold text-done' : 'text-muted',
              )}
            >
              {rule.ok ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <Circle size={10} strokeWidth={2.5} />
              )}
              {rule.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
