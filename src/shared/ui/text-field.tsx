import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: ReactNode
  /** 입력칸 오른쪽에 붙는 요소 (예: 비밀번호 "보기") */
  suffix?: ReactNode
}

/** 입력 기본 · 포커스 · 오류 (디자인 00) */
export function TextField({ label, error, suffix, className, id, ...props }: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-12 items-center rounded-[10px] border border-line px-3.5 transition-shadow',
          'focus-within:border-[1.5px] focus-within:border-sky focus-within:shadow-[0_0_0_4px_var(--color-sky-soft)]',
          error && 'border-[1.5px] border-error focus-within:border-error focus-within:shadow-none',
        )}
      >
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
          {...props}
        />
        {suffix}
      </div>
      {error && <span className="text-[13px] text-error">{error}</span>}
    </div>
  )
}
