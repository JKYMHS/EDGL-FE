import { Link } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { Checkbox, DdayBadge, IoLabel, OpenStatusChip, StatusChip } from '@/shared/ui'
import type { ContentItem } from '../model/types'
import type { ContentSelection } from '../model/use-content-selection'
import { LikeButton } from './like-button'

function isDimmed(item: ContentItem) {
  return item.kind === 'festival' ? item.status === '종료' : item.openStatus === 'closed'
}

/**
 * 찜 카드 (마이페이지 찜한 곳). 표 행(ContentRow)과 같은 선택 상태를 쓰고,
 * 왼쪽 위 번호가 옆 지도 마커 번호와 같다.
 */
export function ContentCard({
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
  const isFestival = item.kind === 'festival'

  return (
    <li
      aria-label={item.name}
      aria-current={selected || undefined}
      onClick={() => selection.select(item.id)}
      onMouseEnter={() => selection.hover(item.id)}
      onMouseLeave={() => selection.hover(undefined)}
      className={cn(
        'flex cursor-pointer flex-col overflow-hidden rounded-[14px] bg-white transition-shadow',
        selected
          ? 'shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
          : hovered
            ? 'shadow-[inset_0_0_0_1px_var(--color-line-strong),0_6px_16px_rgba(30,36,32,.08)]'
            : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
      )}
    >
      <div
        className={cn(
          'relative m-[1.5px] mb-0 h-[112px] rounded-t-[12.5px]',
          isDimmed(item) && 'opacity-55',
        )}
        style={{ background: item.thumb }}
      >
        <span
          className={cn(
            'absolute top-2.5 left-2.5 grid size-[23px] place-items-center rounded-full border-2 border-white font-mono text-[9px] font-semibold text-white',
            selected || hovered ? 'bg-sky' : 'bg-ink',
          )}
        >
          {n}
        </span>
        {isFestival && <DdayBadge className="absolute bottom-2.5 left-2.5">{item.dday}</DdayBadge>}
        <LikeButton
          liked={liked}
          name={item.name}
          onClick={() => onLike(item)}
          className="absolute top-2 right-2 size-8 rounded-full bg-white/90"
        />
      </div>

      <div className={cn('flex flex-1 flex-col gap-1 px-3.5 pt-3', isDimmed(item) && 'opacity-55')}>
        <span className="truncate text-[15px] font-semibold">{item.name}</span>
        <span className="flex items-center gap-1.5 text-xs text-sub">
          <span className="truncate">
            {item.region}
            {!isFestival && (
              <>
                {' · '}
                <span className="font-semibold text-sky-text">{item.category}</span>
              </>
            )}
          </span>
          <IoLabel value={item.io} />
        </span>
        <span className="flex items-center gap-1.5 pt-1">
          {isFestival ? (
            <>
              <StatusChip status={item.status} />
              <span className="truncate font-mono text-[11px] font-semibold text-sub">
                {item.period}
              </span>
            </>
          ) : (
            <>
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
            </>
          )}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-surface px-3.5 py-2.5">
        <label
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'flex cursor-pointer items-center gap-2 text-[13px] font-semibold',
            compared ? 'text-sky-text' : 'text-sub',
          )}
        >
          <Checkbox
            checked={compared}
            onCheckedChange={() => selection.toggleCompare(item.id)}
            label={`${item.name} 비교에 담기`}
          />
          {compared ? '비교 중' : '비교에 담기'}
        </label>
        <Link
          to={`/places/${item.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[13px] font-semibold text-sky-text hover:underline"
        >
          자세히
        </Link>
      </div>
    </li>
  )
}

/** 찜 카드 목록 (2열) */
export function ContentCardGrid({
  items,
  selection,
  onLike,
  label,
}: {
  items: ContentItem[]
  selection: ContentSelection
  onLike: (item: ContentItem) => void
  label: string
}) {
  return (
    <ul aria-label={label} className="grid grid-cols-2 gap-3.5">
      {items.map((item, i) => (
        <ContentCard key={item.id} item={item} n={i + 1} selection={selection} onLike={onLike} />
      ))}
    </ul>
  )
}
