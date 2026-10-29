import { Link } from 'react-router'
import { ExploreMarker, MapCanvas, MapPin } from '@/shared/map'
import { DdayBadge, OpenStatusChip, StatusChip } from '@/shared/ui'
import type { ContentItem } from '../model/types'
import type { ContentSelection } from '../model/use-content-selection'

function SelectedCard({
  item,
  note,
  compared,
  onToggleCompare,
}: {
  item: ContentItem
  note?: string
  compared: boolean
  onToggleCompare: () => void
}) {
  return (
    <div className="w-[280px] overflow-hidden rounded-[14px] bg-white shadow-[0_10px_28px_rgba(30,36,32,.2)]">
      <div className="relative h-[120px] bg-map">
        {item.kind === 'festival' ? (
          <>
            <StatusChip status={item.status} className="absolute top-2.5 left-2.5" />
            <DdayBadge className="absolute top-2.5 right-2.5">{item.dday}</DdayBadge>
          </>
        ) : (
          <>
            <OpenStatusChip status={item.openStatus} className="absolute top-2.5 left-2.5" />
            <DdayBadge className="absolute top-2.5 right-2.5">{item.hours}</DdayBadge>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1 px-3.5 pt-3 pb-3.5">
        <span className="text-base font-bold">{item.name}</span>
        <span className="text-[13px] text-sub">
          {item.kind === 'festival' ? (
            <>
              {item.region} · <span className="font-mono text-xs">{item.period}</span>
            </>
          ) : (
            (note ?? item.region)
          )}
        </span>
        <div className="mt-2 flex gap-2">
          <Link
            to={`/places/${item.id}`}
            className="grid h-9 flex-1 place-items-center rounded-[9px] bg-sky-soft text-[13px] font-semibold text-sky-text"
          >
            자세히
          </Link>
          <button
            type="button"
            onClick={onToggleCompare}
            className="grid h-9 flex-1 place-items-center rounded-[9px] border border-line text-[13px] font-semibold text-sky-text"
          >
            {compared ? '비교에서 빼기' : '비교에 담기'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** 탐색·찜 지도: 번호 마커 + 선택한 곳 카드 */
export function ContentMap({
  items,
  selection,
  showCard = true,
  selectedNote,
  road = false,
}: {
  items: ContentItem[]
  selection: ContentSelection
  showCard?: boolean
  selectedNote?: string
  road?: boolean
}) {
  const selected = items.find((item) => item.id === selection.selectedId)
  return (
    <MapCanvas road={road}>
      {items.map((item, i) => {
        const state =
          item.id === selection.selectedId
            ? 'selected'
            : item.id === selection.hoverId
              ? 'hover'
              : 'default'
        const dimmed =
          item.kind === 'festival' ? item.status === '종료' : item.openStatus === 'closed'
        return (
          <ExploreMarker
            key={item.id}
            point={item.point}
            n={i + 1}
            state={state}
            dimmed={dimmed}
            label={item.name}
            onClick={() => selection.select(item.id)}
            onHover={(on) => selection.hover(on ? item.id : undefined)}
          />
        )
      })}
      {showCard && selected && (
        <MapPin point={selected.point} anchor="bottom" z={20} className="-mt-[54px]">
          <SelectedCard
            item={selected}
            note={selectedNote}
            compared={selection.compareIds.includes(selected.id)}
            onToggleCompare={() => selection.toggleCompare(selected.id)}
          />
        </MapPin>
      )}
    </MapCanvas>
  )
}
