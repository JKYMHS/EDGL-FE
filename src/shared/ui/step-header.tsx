import { Check } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Logo } from './logo'

function HeaderShell({ children }: { children: ReactNode }) {
  return (
    <header className="flex h-[76px] shrink-0 items-center gap-6 border-b border-line px-8">
      {children}
    </header>
  )
}

/** 진행 막대형 단계 헤더 (온보딩 03, 추천 요청 07): 로고 · 막대 · 오른쪽 행동 */
export function ProgressStepHeader({
  total,
  current,
  badge,
  action,
}: {
  total: number
  current: number
  badge?: ReactNode
  action: ReactNode
}) {
  return (
    <HeaderShell>
      <Logo />
      {badge}
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`${total}단계 중 ${current}단계`}
        className="mx-auto flex max-w-[420px] flex-1 gap-1"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn('h-1 flex-1 rounded-sm', i < current ? 'bg-sky' : 'bg-line')}
          />
        ))}
      </div>
      {action}
    </HeaderShell>
  )
}

/** 이름 붙은 단계 헤더 (회원가입 02): ✓ 지난 단계 · 지금 단계 강조 · 남은 단계 */
export function NamedStepHeader({
  steps,
  current,
  action,
}: {
  steps: string[]
  current: number
  action: ReactNode
}) {
  return (
    <HeaderShell>
      <Logo />
      <ol className="flex flex-1 items-center justify-center gap-3">
        {steps.map((name, i) => {
          const n = i + 1
          const done = n < current
          const active = n === current
          return (
            <Fragment key={name}>
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn('h-0.5 w-12', n <= current ? 'bg-ink' : 'bg-line')}
                />
              )}
              <li
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold whitespace-nowrap',
                  active &&
                    'rounded-full bg-sky-soft py-1.5 pr-3.5 pl-1.5 font-bold text-sky-text shadow-[inset_0_0_0_1.5px_var(--color-sky)]',
                  !done && !active && 'text-muted',
                )}
              >
                <span
                  className={cn(
                    'grid size-6 place-items-center rounded-full font-mono text-xs font-bold',
                    done && 'bg-ink text-white',
                    active && 'bg-sky text-white',
                    !done && !active && 'border-[1.5px] border-line-strong',
                  )}
                >
                  {done ? <Check size={13} strokeWidth={3.5} /> : n}
                </span>
                {name}
              </li>
            </Fragment>
          )
        })}
      </ol>
      {action}
    </HeaderShell>
  )
}

/** "1 / 5" + 큰 제목 + 설명 */
export function StepHeading({
  current,
  total,
  title,
  description,
  align = 'left',
  aside,
}: {
  current: number
  total: number
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  aside?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        align === 'center' && 'items-center gap-2.5 text-center',
      )}
    >
      <div className="flex items-center justify-between self-stretch">
        <span
          className={cn(
            'font-mono text-[13px] font-semibold text-sky-text',
            align === 'center' && 'mx-auto',
          )}
        >
          {current} / {total}
        </span>
        {aside}
      </div>
      <h1 className="text-[34px] font-bold tracking-[-0.02em]">{title}</h1>
      {description && <p className="text-base text-sub">{description}</p>}
    </div>
  )
}
