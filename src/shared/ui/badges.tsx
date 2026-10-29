import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type FestivalStatus = '진행중' | '예정' | '종료'

/** 축제 진행 상태 칩 (디자인 00) */
export function StatusChip({ status, className }: { status: FestivalStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border-[1.5px] px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        status === '진행중' && 'border-sky bg-sky text-white',
        status === '예정' && 'border-ink bg-white text-ink',
        status === '종료' && 'border-surface bg-surface text-sub',
        className,
      )}
    >
      {status}
    </span>
  )
}

/** 검은 바탕 D-day 배지 */
export function DdayBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-ink px-[7px] py-[3px] font-mono text-xs font-bold text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}

export type OpenStatus = 'open' | 'soon' | 'closed'
const OPEN_LABEL: Record<OpenStatus, string> = {
  open: '운영 중',
  soon: '곧 마감',
  closed: '오늘 휴무',
}

/** 관광지 오늘 운영 상태 칩 */
export function OpenStatusChip({ status, className }: { status: OpenStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        status === 'open' && 'bg-done-soft text-done',
        status === 'soon' && 'bg-warn-soft text-warn',
        status === 'closed' && 'bg-surface text-sub',
        className,
      )}
    >
      {OPEN_LABEL[status]}
    </span>
  )
}

export type SyncState = 'synced' | 'changed' | 'none'
const SYNC: Record<SyncState, [string, string, string]> = {
  synced: ['동기화됨', '●', 'bg-done-soft text-done'],
  changed: ['변경 있음', '●', 'bg-warn-soft text-warn'],
  none: ['미업로드', '○', 'bg-field text-sub'],
}

/** 캘린더 동기화 상태 (디자인 00) */
export function SyncBadge({ state, className }: { state: SyncState; className?: string }) {
  const [label, dot, tone] = SYNC[state]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-[9px] py-[3px] text-xs font-semibold whitespace-nowrap',
        tone,
        className,
      )}
    >
      <span aria-hidden>{dot}</span>
      {label}
    </span>
  )
}

export type IoType = '실내' | '실외' | '실내·실외'

/** 실내·실외 회색 라벨 (PRD 6.1) */
export function IoLabel({ value, className }: { value: IoType; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-[5px] bg-field px-1.5 py-px text-[11px] font-semibold whitespace-nowrap text-sub',
        className,
      )}
    >
      {value}
    </span>
  )
}

/** ▲ 경고 문구 */
export function WarningText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-semibold text-warn', className)}
    >
      <span aria-hidden>▲</span>
      {children}
    </span>
  )
}
