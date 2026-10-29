import { RotateCw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { LoginRequiredModal, usePreviewSession, type LoginGateReason } from '@/features/auth'
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
  exploreAttractionDefaults,
  exploreAttractions,
  exploreFestivalDefaults,
  exploreFestivals,
  exploreMeta,
} from '@/mocks/data/contents'
import { ZoomControl } from '@/shared/map'
import { Chip, LeftPanel, SplitLayout, Tabs } from '@/shared/ui'

type Tab = 'festival' | 'place'

const CHIPS: Record<Tab, string[]> = {
  festival: ['전체', '지금 진행중', '이번 주말', '인기 800+'],
  place: ['전체', '지금 운영 중', '고궁·마을', '박물관·전시', '전망·공원'],
}

/** 탐색 홈 (디자인 04 축제 탭, 04-2 관광지 탭) · FUNC-002-01~03, 07, 08 */
export default function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'place' ? 'place' : 'festival'
  // 탭마다 선택 상태를 따로 둔다
  return (
    <ExploreTab
      key={tab}
      tab={tab}
      onTabChange={(t) => setParams({ ...Object.fromEntries(params), tab: t })}
    />
  )
}

function ExploreTab({ tab, onTabChange }: { tab: Tab; onTabChange: (tab: Tab) => void }) {
  const navigate = useNavigate()
  const { isLoggedIn } = usePreviewSession()
  const items: ContentItem[] = tab === 'festival' ? exploreFestivals : exploreAttractions
  const defaults = tab === 'festival' ? exploreFestivalDefaults : exploreAttractionDefaults
  const selection = useContentSelection({ ...defaults, likedIds: likedIdsOf(items) })
  const [chip, setChip] = useState(CHIPS[tab][0])
  const [params] = useSearchParams()
  // 화면 목록에서 14-2 "비교 바" 상황을 바로 열 수 있게 한다
  const [gate, setGate] = useState<{ reason: LoginGateReason; name?: string } | undefined>(
    !isLoggedIn && params.get('modal') === 'compare' ? { reason: 'compare' } : undefined,
  )

  const compared = pickByIds(items, selection.compareIds)

  const onLike = (item: ContentItem) => {
    if (!isLoggedIn) return setGate({ reason: 'wish', name: item.name })
    selection.toggleLike(item.id)
  }
  const onRecommend = () => {
    if (!isLoggedIn) return setGate({ reason: 'compare' })
    navigate('/recommend?step=5')
  }

  return (
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-col gap-3.5 px-6 pt-[18px]">
            <div className="flex items-center justify-between border-b border-line">
              <Tabs
                label="콘텐츠 종류"
                value={tab}
                onChange={onTabChange}
                items={[
                  { value: 'festival', label: '축제', count: exploreMeta.festivalCount },
                  { value: 'place', label: '관광지', count: exploreMeta.attractionCount },
                ]}
              />
              <span className="pb-2 text-[13px] text-sub">
                {tab === 'festival' ? (
                  <>
                    {exploreMeta.regionLabel} · 결과{' '}
                    <span className="font-mono font-semibold text-sky-text">
                      {exploreMeta.festivalCount}
                    </span>
                  </>
                ) : (
                  <>
                    {exploreMeta.regionLabel} · 오늘{' '}
                    <span className="font-mono font-semibold text-ink">10.19</span> 월 기준
                  </>
                )}
              </span>
            </div>
            <div className="flex gap-2">
              {CHIPS[tab].map((label) => (
                <Chip key={label} selected={chip === label} onClick={() => setChip(label)}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
          <ContentTableHeader statusLabel={tab === 'festival' ? '상태' : '오늘 운영'} />
          <ContentTable items={items} selection={selection} onLike={onLike} />
          <CompareTray
            items={compared}
            onRemove={selection.removeCompare}
            actionLabel="이 장소들로 코스 추천"
            onAction={onRecommend}
          />
        </LeftPanel>
      }
      right={
        <>
          <ContentMap
            items={items}
            selection={selection}
            road
            selectedNote={tab === 'place' ? exploreAttractionDefaults.selectedNote : undefined}
          />
          <button
            type="button"
            className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-4 py-[9px] text-sm font-semibold text-sky-text shadow-[0_2px_8px_rgba(30,36,32,.14)]"
          >
            <RotateCw size={14} strokeWidth={2.5} />이 지역에서 다시 찾기
          </button>
          <ZoomControl />
          {gate && (
            <LoginRequiredModal
              open
              onOpenChange={(open) => !open && setGate(undefined)}
              reason={gate.reason}
              targetName={gate.name}
            />
          )}
        </>
      }
    />
  )
}
