import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Checkbox, IoLabel, OpenStatusChip, StatusChip } from '@/shared/ui'
import type { ContentItem } from '../model/types'
import type { ContentSelection } from '../model/use-content-selection'
import { LikeButton } from './like-button'

const GRID = 'grid grid-cols-[36px_minmax(0,1fr)_148px_48px] gap-[15px]'

export function ContentTableHeader({ statusLabel }: { statusLabel: string }) {
  return (
    <div className={cn(GRID, 'border-b border-line px-6 pt-4 pb-2 text-xs font-semibold text-sub')}>
      <span />
      <span>이름</span>
      <span>{statusLabel}</span>
      <span />
    </div>
  )
}

function isDimmed(item: ContentItem) {
  return item.kind === 'festival' ? item.status === '종료' : item.openStatus === 'closed'
}

function StatusCell({ item }: { item: ContentItem }) {
  if (item.kind === 'festival') {
    return (
      <div className="flex items-center gap-1.5">
        <StatusChip status={item.status} />
        <span className="font-mono text-[11px] font-bold whitespace-nowrap">{item.dday}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      <OpenStatusChip status={item.openStatus} />
      <span
        className={cn(
          'font-mono text-[11px] font-bold whitespace-nowrap',
          item.openStatus === 'soon' && 'text-warn',
          item.openStatus === 'closed' && 'font-medium text-muted',
        )}
      >
        {item.hours}
      </span>
    </div>
  )
}

/** 축제·관광지 표 행 (디자인 04, 04-2, 06, 06-2) */
export function ContentRow({
  item,
  n,
  selection,
  onLike,
}: {
  item: ContentItem
  n: number
  selection: ContentSelection
  onLike: (item: ContentItem) => void
}) {
  const selected = selection.selectedId === item.id
  const hovered = selection.hoverId === item.id
  const compared = selection.compareIds.includes(item.id)
  const liked = selection.likedIds.includes(item.id)

  let meta: ReactNode = item.region
  if (item.kind === 'attraction') {
    meta = (
      <>
        {item.region} · <span className="font-semibold text-sky-text">{item.category}</span>
      </>
    )
  }

  return (
    <div
      role="row"
      aria-selected={selected}
      onClick={() => selection.select(item.id)}
      onMouseEnter={() => selection.hover(item.id)}
      onMouseLeave={() => selection.hover(undefined)}
      className={cn(
        GRID,
        'cursor-pointer items-center rounded-xl px-3 py-[11px] transition-colors',
        selected
          ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
          : hovered && 'bg-[#F5F8FA]',
        isDimmed(item) && 'opacity-55',
      )}
    >
      <Checkbox
        size="xl"
        checked={compared}
        onCheckedChange={() => selection.toggleCompare(item.id)}
        label={`${item.name} 비교에 담기`}
      />
      <div className="flex min-w-0 items-center gap-[15px]">
        <span
          className="relative h-[58px] w-[79px] shrink-0 rounded-[10px]"
          style={{ background: item.thumb }}
        >
          <span
            className={cn(
              'absolute -top-[7px] -left-[7px] grid size-[23.5px] place-items-center rounded-full border-2 border-white font-mono text-[9px] font-semibold text-white',
              selected || hovered ? 'bg-sky' : 'bg-ink',
            )}
          >
            {n}
          </span>
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[14.5px] font-semibold">{item.name}</span>
          <span className="flex items-center gap-1.5 text-xs text-sub">
            <span>{meta}</span>
            <IoLabel value={item.io} />
          </span>
        </div>
      </div>
      <StatusCell item={item} />
      <LikeButton liked={liked} name={item.name} onClick={() => onLike(item)} />
    </div>
  )
}

export function ContentTable({
  items,
  selection,
  onLike,
}: {
  items: ContentItem[]
  selection: ContentSelection
  onLike: (item: ContentItem) => void
}) {
  return (
    <div role="grid" aria-label="목록" className="flex-1 overflow-y-auto px-3 pt-1 pb-24">
      {items.map((item, i) => (
        <ContentRow key={item.id} item={item} n={i + 1} selection={selection} onLike={onLike} />
      ))}
    </div>
  )
}
