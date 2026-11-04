import { Plus } from 'lucide-react'
import { useState } from 'react'
import { durationLabel } from '@/shared/lib/time'
import { Button, Modal, SearchMark, Tabs } from '@/shared/ui'
import type { AddPlaceCandidate, AddPlaceSource } from '../model/types'

const SOURCES: { value: AddPlaceSource; label: string }[] = [
  { value: 'liked', label: '찜한 곳' },
  { value: 'search', label: '검색' },
  { value: 'nearby', label: '식사·숙소 추천' },
]

/** 일정 편집 "장소 추가 (찜 · 검색 · 식사·숙소 추천)" · FUNC-004-02 */
export function AddPlaceModal({
  open,
  onOpenChange,
  dayLabel,
  candidates,
  addedIds,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** "1일차" */
  dayLabel: string
  candidates: Record<AddPlaceSource, AddPlaceCandidate[]>
  /** 이미 일정에 있는 후보 */
  addedIds: string[]
  onAdd: (candidate: AddPlaceCandidate) => void
}) {
  const [source, setSource] = useState<AddPlaceSource>('liked')
  const [query, setQuery] = useState('')
  const q = query.trim()
  const list =
    source === 'search'
      ? q
        ? candidates.search.filter((c) => c.name.includes(q) || c.meta.includes(q))
        : []
      : candidates[source]

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      closeButton
      title="장소 추가"
      description={
        <span className="text-sm">{dayLabel} 맨 끝에 붙여요. 끌어서 순서를 바꿀 수 있어요.</span>
      }
      className="h-[600px] w-[560px] gap-4 rounded-[20px]"
    >
      <div className="border-b border-line">
        <Tabs label="장소 찾는 방법" value={source} onChange={setSource} items={SOURCES} />
      </div>
      {source === 'search' && (
        <label className="flex h-12 items-center gap-2.5 rounded-[10px] border border-line px-3.5 focus-within:border-sky">
          <SearchMark />
          <input
            aria-label="장소 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="관광지·축제 이름, 지역"
            className="min-w-0 flex-1 text-[15px] outline-none placeholder:text-muted"
          />
        </label>
      )}
      <ul aria-label="추가할 장소" className="-mx-2 flex min-h-0 flex-1 flex-col overflow-y-auto">
        {list.map((c) => {
          const added = addedIds.includes(c.id)
          return (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-[10px] px-2 py-2.5 hover:bg-[#F5F8FA]"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[15px] font-semibold">{c.name}</span>
                <span className="truncate text-xs text-sub">
                  {c.meta} · 머무는 시간 {durationLabel(c.stay)}
                </span>
              </span>
              <Button
                variant={added ? 'secondary' : 'soft'}
                size="xs"
                className="px-3"
                disabled={added}
                onClick={() => onAdd(c)}
                aria-label={added ? `${c.name} 추가됨` : `${c.name} 추가`}
              >
                {added ? (
                  '추가됨'
                ) : (
                  <>
                    <Plus size={13} strokeWidth={2.5} />
                    추가
                  </>
                )}
              </Button>
            </li>
          )
        })}
        {list.length === 0 && (
          <li className="py-14 text-center text-sm text-sub">
            {source === 'search' && !q ? '이름이나 지역으로 찾아보세요' : '찾는 장소가 없어요'}
          </li>
        )}
      </ul>
    </Modal>
  )
}
