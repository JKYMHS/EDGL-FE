import { cn } from '@/shared/lib/cn'

const LENGTH = 6

/** 6자리 인증 코드 칸 (FUNC-001-06). 실제 입력은 숨은 input 하나가 받는다 */
export function CodeInput({
  value,
  onChange,
  error = false,
  label = '인증 코드 6자리',
}: {
  value: string
  onChange: (value: string) => void
  error?: boolean
  label?: string
}) {
  return (
    <label className="relative grid grid-cols-6 gap-2">
      <input
        aria-label={label}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={LENGTH}
        value={value}
        aria-invalid={error || undefined}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, LENGTH))}
        className="peer absolute inset-0 opacity-0"
      />
      {Array.from({ length: LENGTH }, (_, i) => {
        const current = i === value.length
        return (
          <span
            key={i}
            aria-hidden
            className={cn(
              'grid h-14 place-items-center rounded-[10px] border border-line font-mono text-[22px] font-bold',
              error && 'border-[1.5px] border-error',
              current &&
                !error &&
                'peer-focus:border-[1.5px] peer-focus:border-sky peer-focus:shadow-[0_0_0_4px_var(--color-sky-soft)]',
            )}
          >
            {value[i]}
          </span>
        )
      })}
    </label>
  )
}
