import { ArrowUpRight, ChevronLeft, Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { LoginRequiredModal, usePreviewSession, type LoginGateReason } from '@/features/auth'
import { AddToTripModal, NewTripModal } from '@/features/trip'
import { addToTripDemo, newTripOptions } from '@/mocks/data/course'
import { nearbyDefaultChecked, nearbyPlaces, placeDetail as place } from '@/mocks/data/place'
import { cn } from '@/shared/lib/cn'
import { MapCanvas, MapPanel, MapPin, NumberMarker } from '@/shared/map'
import {
  Button,
  Checkbox,
  DdayBadge,
  LeftPanel,
  PanelTray,
  SplitLayout,
  StatusChip,
  Toast,
} from '@/shared/ui'

function isGateReason(value: string | null): value is LoginGateReason {
  return value === 'wish' || value === 'recommend' || value === 'compare' || value === 'trip'
}

/** 상세 (디자인 05, 비로그인 찜 14-1) · FUNC-002-04, 05, 09, 004-06 */
export default function PlaceDetailPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { isLoggedIn } = usePreviewSession()
  const [liked, setLiked] = useState(true)
  const [checked, setChecked] = useState(nearbyDefaultChecked)
  const initialGate = params.get('modal')
  const [gate, setGate] = useState<LoginGateReason | undefined>(
    !isLoggedIn && isGateReason(initialGate) ? initialGate : undefined,
  )

  const [tripModal, setTripModal] = useState<'add' | 'new' | undefined>(
    isLoggedIn && params.get('modal') === 'add' ? 'add' : undefined,
  )
  const [addedTo, setAddedTo] = useState<string>()

  const guard = (reason: LoginGateReason, run: () => void) => (isLoggedIn ? run() : setGate(reason))
  const toggleNearby = (id: string) =>
    setChecked((list) => (list.includes(id) ? list.filter((v) => v !== id) : [...list, id]))

  return (
    <SplitLayout
      left={
        <LeftPanel>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-8 pt-5 pb-[100px] *:shrink-0">
            <nav aria-label="위치" className="flex items-center gap-1 text-[13px] text-sub">
              <Link to="/explore" className="flex items-center hover:text-ink">
                <ChevronLeft size={13} />
                {place.breadcrumb[0]}
              </Link>
              <span className="text-line-strong">/</span>
              {place.breadcrumb[1]}
            </nav>
            <div className="grid h-[280px] grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-2">
              <div className="grid place-items-center rounded-[14px] bg-map text-xs text-sub">
                대표 이미지
              </div>
              <div className="grid grid-rows-2 gap-2">
                <div className="rounded-[14px] bg-[#E3E8EC]" />
                <button
                  type="button"
                  className="grid place-items-center rounded-[14px] bg-[#D6DEE4] text-[13px] font-semibold text-sub"
                >
                  +{place.extraImageCount}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <StatusChip status={place.status} className="text-xs" />
                <DdayBadge>{place.dday}</DdayBadge>
                <span className="ml-1 flex gap-1.5">
                  <span className="flex h-[26px] items-center gap-1.5 rounded-full bg-sky-soft px-2.5 text-[13px] font-semibold text-sky-text">
                    인기{' '}
                    <span className="font-mono font-bold text-[#0A3A5C]">{place.popularity}</span>
                  </span>
                  <span className="flex h-[26px] items-center gap-1.5 rounded-full bg-[#FDEEEA] px-2.5 text-[13px] font-semibold text-[#B8401F]">
                    <Heart size={12} fill="currentColor" strokeWidth={0} className="text-like" />찜{' '}
                    <span className="font-mono font-bold text-[#7A2A14]">{place.likeCount}</span>
                  </span>
                  <span className="flex h-[26px] items-center rounded-full bg-field px-2.5 text-[13px] font-semibold text-sub">
                    {place.io}
                  </span>
                </span>
              </div>
              <h1 className="text-[32px] font-bold tracking-[-0.02em]">{place.name}</h1>
              <p className="text-[15px] leading-relaxed text-[#3E4640]">{place.summary}</p>
            </div>
            <dl className="flex flex-col border-b border-surface">
              {place.info.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[96px_1fr] border-t border-surface py-3 text-sm"
                >
                  <dt className="text-sub">{row.label}</dt>
                  <dd className={cn(row.mono && 'font-mono font-medium')}>{row.value}</dd>
                </div>
              ))}
            </dl>
            <section className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[17px] font-bold">함께 가기 좋은 곳</h2>
                <span className="text-xs text-sub">체크하면 코스에 같이 담겨요</span>
              </div>
              {nearbyPlaces.map((p) => (
                <label
                  key={p.id}
                  className="-mx-3 grid cursor-pointer grid-cols-[28px_minmax(0,1fr)_90px] items-center gap-3 rounded-[10px] px-3 py-2 hover:bg-[#F5F8FA]"
                >
                  <Checkbox
                    size="sm"
                    checked={checked.includes(p.id)}
                    onCheckedChange={() => toggleNearby(p.id)}
                    label={`${p.name} 코스에 같이 담기`}
                  />
                  <span className="flex items-center gap-3">
                    <span className="h-9 w-12 rounded-[7px]" style={{ background: p.thumb }} />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-semibold">{p.name}</span>
                      <span className="text-xs text-sub">{p.category}</span>
                    </span>
                  </span>
                  <span className="text-right font-mono text-xs font-medium text-sub">
                    {p.distance}
                  </span>
                </label>
              ))}
            </section>
          </div>
          <PanelTray className="gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="px-3.5"
              aria-pressed={liked}
              onClick={() => guard('wish', () => setLiked((v) => !v))}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} className="text-like" />
              {liked ? '찜함' : '찜하기'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="px-3.5"
              onClick={() => guard('trip', () => setTripModal('add'))}
            >
              <Plus size={14} strokeWidth={2.5} />
              일정에 추가
            </Button>
            <span className="flex-1" />
            <span className="text-[13px] text-sub">
              함께 <span className="font-mono">+{checked.length}</span>
            </span>
            <Button
              size="sm"
              onClick={() => guard('recommend', () => navigate('/recommend?step=5'))}
            >
              이 장소로 코스 추천받기
            </Button>
          </PanelTray>
        </LeftPanel>
      }
      right={
        <>
          <MapCanvas
            river="high"
            svg={
              <ellipse
                cx={50}
                cy={52}
                rx={19.7}
                ry={17}
                fill="rgba(30,157,235,.06)"
                stroke="#B9E1FA"
                strokeWidth={1.5}
                strokeDasharray="4 6"
                vectorEffect="non-scaling-stroke"
              />
            }
          >
            <MapPin point={{ x: 50, y: 52 }} z={6}>
              <span className="block size-10 rounded-full border-[3px] border-white bg-sky shadow-[0_0_0_8px_rgba(30,157,235,.2),0_2px_8px_rgba(30,36,32,.25)]" />
            </MapPin>
            <MapPin point={{ x: 50, y: 52 }} anchor="bottom" z={7} className="-mt-[30px]">
              <span className="rounded-lg bg-white px-2.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[0_2px_8px_rgba(30,36,32,.14)]">
                {place.name}
              </span>
            </MapPin>
            {nearbyPlaces.map((p, i) => (
              <NumberMarker
                key={p.id}
                point={p.point}
                n={i + 1}
                size={26}
                color={checked.includes(p.id) ? '#1E9DEB' : '#1E2420'}
                className="text-[11px]"
              />
            ))}
          </MapCanvas>
          <MapPanel className="top-4 left-4 rounded-[10px] px-3.5 py-2.5 text-[13px] text-sub">
            점선 원 = 도보 15분 반경
          </MapPanel>
          <a
            href="https://map.kakao.com"
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-white px-4 py-[9px] text-sm font-semibold shadow-[0_2px_8px_rgba(30,36,32,.14)]"
          >
            길찾기 <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>
          {gate && (
            <LoginRequiredModal
              open
              onOpenChange={(open) => !open && setGate(undefined)}
              reason={gate}
              targetName={gate === 'wish' ? place.name : undefined}
            />
          )}
          {tripModal === 'add' && (
            <AddToTripModal
              open
              onOpenChange={(open) => !open && setTripModal(undefined)}
              placeName={addToTripDemo.place.name}
              placePeriod={addToTripDemo.place.period}
              trips={addToTripDemo.trips}
              onNewTrip={() => setTripModal('new')}
              onAdd={(title) => {
                setTripModal(undefined)
                setAddedTo(title)
              }}
            />
          )}
          <NewTripModal
            open={tripModal === 'new'}
            onOpenChange={(open) => !open && setTripModal(undefined)}
            regions={newTripOptions.regions}
            companions={newTripOptions.companions}
            onCreate={() => navigate('/trips/t-busan')}
          />
          {addedTo && (
            <Toast
              onClose={() => setAddedTo(undefined)}
              action={
                <button
                  type="button"
                  onClick={() => navigate('/trips/t-cheonggye')}
                  className="rounded-full bg-sky px-3.5 py-[7px] font-semibold"
                >
                  여행 보기
                </button>
              }
            >
              {addedTo}에 담았어요
            </Toast>
          )}
        </>
      }
    />
  )
}
