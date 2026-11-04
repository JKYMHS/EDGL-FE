import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  CompareTray,
  ContentCardGrid,
  ContentMap,
  likedIdsOf,
  pickByIds,
  useContentSelection,
  type ContentItem,
} from '@/features/explore'
import {
  likedAttractionDefaults,
  likedAttractions,
  likedFestivalDefaults,
  likedFestivals,
} from '@/mocks/data/contents'
import { Tabs, Toggle } from '@/shared/ui'

type Tab = 'festival' | 'place'

/**
 * 마이페이지 — 찜한 곳 (디자인 06·06-2를 마이페이지 본문에 맞게 바꿈) · FUNC-002-06, 08
 * 사이드 메뉴 옆이라 표 + 큰 지도 대신 카드 2열 + 오른쪽 좁은 지도로 보여 준다.
 */
export default function LikesPage() {
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'place' ? 'place' : 'festival'
  return (
    <LikesTab
      key={tab}
      tab={tab}
      onTabChange={(t) => setParams({ ...Object.fromEntries(params), tab: t })}
    />
  )
}

function LikesTab({ tab, onTabChange }: { tab: Tab; onTabChange: (tab: Tab) => void }) {
  const navigate = useNavigate()
  const isFestival = tab === 'festival'
  const items: ContentItem[] = isFestival ? likedFestivals : likedAttractions
  const defaults = isFestival ? likedFestivalDefaults : likedAttractionDefaults
  const selection = useContentSelection({ ...defaults, likedIds: likedIdsOf(items) })
  const [hideInactive, setHideInactive] = useState(false)

  const visible = hideInactive
    ? items.filter((item) =>
        item.kind === 'festival' ? item.status !== '종료' : item.openStatus !== 'closed',
      )
    : items
  const compared = pickByIds(items, selection.compareIds)
  const hideLabel = isFestival ? '종료된 축제 숨기기' : '오늘 휴무 숨기기'

  return (
    <div className="flex min-w-0 flex-1">
      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-4 px-10 pt-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-[-0.015em]">찜한 곳</h1>
            <p className="text-sm text-sub">
              찜한 축제·관광지를 모아 비교하고, 고른 곳들로 코스를 추천받아요.
            </p>
          </div>
          <div className="flex items-end justify-between border-b border-line">
            <Tabs
              label="콘텐츠 종류"
              value={tab}
              onChange={onTabChange}
              items={[
                { value: 'festival', label: '축제', count: likedFestivals.length },
                { value: 'place', label: '관광지', count: likedAttractions.length },
              ]}
            />
            <label className="flex items-center gap-1.5 pb-3 text-[13px] font-semibold text-sub">
              {hideLabel}
              <Toggle
                size="sm"
                checked={hideInactive}
                onCheckedChange={setHideInactive}
                label={hideLabel}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-10 pt-5 pb-28">
          {compared.length > 0 && (
            <div
              role="note"
              aria-label="비교 요약"
              className="flex flex-col gap-1 rounded-xl bg-sky-soft px-4 py-3"
            >
              <span className="text-[13px] font-bold text-sky-text">
                비교 중인 <span className="font-mono">{compared.length}</span>곳
              </span>
              <p className="text-[13px] leading-normal text-sub">
                {defaults.summary.parts.map((part, i) =>
                  'strong' in part && part.strong ? (
                    <strong key={i} className="font-semibold text-ink">
                      {part.text}
                    </strong>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </p>
            </div>
          )}
          {visible.length > 0 ? (
            <ContentCardGrid
              label="찜한 곳 목록"
              items={visible}
              selection={selection}
              onLike={(item) => selection.toggleLike(item.id)}
            />
          ) : (
            <p className="py-16 text-center text-sm text-sub">
              {isFestival ? '진행 중이거나 예정인 축제가 없어요' : '오늘 문 여는 관광지가 없어요'}
            </p>
          )}
        </div>

        <CompareTray
          items={compared}
          onRemove={selection.removeCompare}
          actionLabel="코스 추천"
          onAction={() => navigate('/recommend?step=5')}
          className="right-10 left-10"
        />
      </section>

      <aside aria-label="찜한 곳 지도" className="relative w-[340px] shrink-0 border-l border-line">
        <ContentMap items={visible} selection={selection} showCard={false} />
      </aside>
    </div>
  )
}
