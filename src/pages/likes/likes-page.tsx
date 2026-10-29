import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  CompareTray,
  ContentMap,
  ContentTable,
  ContentTableHeader,
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
import { MapPanel } from '@/shared/map'
import { LeftPanel, SplitLayout, Tabs, Toggle } from '@/shared/ui'

type Tab = 'festival' | 'place'

/** 찜 목록 (디자인 06 축제 탭, 06-2 관광지 탭) · FUNC-002-06, 08 */
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
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-col gap-3.5 px-6 pt-6">
            <div className="flex items-baseline justify-between">
              <h1 className="text-[22px] font-bold tracking-[-0.01em]">찜한 곳</h1>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-sub">
                {hideLabel}
                <Toggle
                  size="sm"
                  checked={hideInactive}
                  onCheckedChange={setHideInactive}
                  label={hideLabel}
                />
              </label>
            </div>
            <div className="border-b border-line">
              <Tabs
                label="콘텐츠 종류"
                value={tab}
                onChange={onTabChange}
                items={[
                  { value: 'festival', label: '축제', count: likedFestivals.length },
                  { value: 'place', label: '관광지', count: likedAttractions.length },
                ]}
              />
            </div>
          </div>
          <ContentTableHeader statusLabel={isFestival ? '상태' : '오늘 운영'} />
          <ContentTable
            items={visible}
            selection={selection}
            onLike={(item) => selection.toggleLike(item.id)}
          />
          <CompareTray
            items={compared}
            onRemove={selection.removeCompare}
            actionLabel="코스 추천"
            onAction={() => navigate('/recommend?step=5')}
          />
        </LeftPanel>
      }
      right={
        <>
          <ContentMap items={visible} selection={selection} showCard={false} />
          {compared.length > 0 && (
            <MapPanel className="top-4 left-4 flex w-[250px] flex-col gap-1.5 px-4 py-3.5">
              <span className="text-[13px] font-bold">비교 중인 {compared.length}곳</span>
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
            </MapPanel>
          )}
        </>
      }
    />
  )
}
