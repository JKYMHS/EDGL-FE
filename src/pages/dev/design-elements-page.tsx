import { useState, type ReactNode } from 'react'
import { DAY_COLORS } from '@/shared/config/day-colors'
import { StartMarker } from '@/shared/map'
import {
  Button,
  Checkbox,
  Chip,
  DdayBadge,
  IoLabel,
  Pill,
  SearchMark,
  StatusChip,
  SyncBadge,
  TextField,
  Tray,
  WarningText,
} from '@/shared/ui'

const SWATCHES = [
  ['배경', '#FFFFFF'],
  ['잉크', '#1E2420'],
  ['보조 텍스트', '#5B635D'],
  ['선', '#E3E6E8'],
  ['하늘 (채움)', '#1E9DEB'],
  ['하늘 (텍스트)', '#0B7BC4'],
  ['선택 배경', '#EAF6FE'],
  ['필드', '#F3F5F7'],
  ['경고', '#A86B00'],
  ['오류', '#B23A2E'],
  ['찜', '#E2552D'],
  ['완료', '#1B7A4B'],
]

function Group({ title, children, wide }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section
      className={
        wide
          ? 'col-span-full flex flex-col gap-3.5 border-t border-surface pt-8'
          : 'flex flex-col gap-3.5'
      }
    >
      <h2 className="text-[13px] font-bold tracking-[0.04em] text-sub">{title}</h2>
      {children}
    </section>
  )
}

/** 개발용: 디자인 00 디자인 요소를 실제 컴포넌트로 보여 준다 */
export default function DesignElementsPage() {
  const [checked, setChecked] = useState(true)
  return (
    <main className="mx-auto grid max-w-[1440px] grid-cols-3 gap-x-14 gap-y-12 p-14">
      <Group title="컬러">
        <div className="grid grid-cols-4 gap-2.5">
          {SWATCHES.map(([name, hex]) => (
            <div key={hex} className="flex flex-col gap-1.5">
              <div
                className="h-12 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(30,36,32,.08)]"
                style={{ background: hex }}
              />
              <span className="text-xs font-semibold">{name}</span>
              <span className="font-mono text-[11px] font-medium text-sub">{hex}</span>
            </div>
          ))}
        </div>
      </Group>
      <Group title="타이포그래피">
        <p className="text-[34px] leading-[1.2] font-bold tracking-[-0.015em]">페이지 제목 34</p>
        <p className="text-[22px] font-bold tracking-[-0.01em]">패널 제목 22</p>
        <p className="text-base font-semibold">행 제목 15–16 · 600</p>
        <p className="text-sm text-sub">본문·메타 13–14 · #5B635D</p>
        <p className="text-xs font-semibold text-sub">표 머리 12 · 600</p>
        <p className="flex items-baseline gap-4 border-t border-surface pt-2 font-mono">
          <span className="text-[22px] font-bold">D-13</span>
          <span className="text-sm font-medium">10.24 – 10.25</span>
          <span className="text-sm font-medium">09:30</span>
          <span className="text-[13px] font-semibold text-sky-text">7/10</span>
        </p>
      </Group>
      <Group title="버튼">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="lg">주요 행동</Button>
          <Button size="lg" variant="secondary">
            보조
          </Button>
          <Button size="lg" variant="soft">
            연한 강조
          </Button>
          <Button size="lg" disabled>
            비활성
          </Button>
        </div>
        <Tray className="gap-3 pl-[18px]">
          <span className="text-[13px] font-semibold">
            비교 <span className="font-mono">2</span>
          </span>
          <span className="flex-1">
            <Pill onRemove={() => undefined}>정동야행</Pill>
          </span>
          <Button size="sm">다음 행동</Button>
        </Tray>
        <p className="text-xs text-sub">
          플로팅 트레이 — 흰 바탕 + 그림자, 선택이 모이는 곳, 화면당 하나
        </p>
      </Group>
      <Group title="입력">
        <div className="flex h-12 items-center gap-2.5 rounded-[14px] border-2 border-sky pr-1.5 pl-4 shadow-[0_4px_14px_rgba(30,157,235,.12)]">
          <SearchMark active />
          <span className="flex-1 text-[15px] text-muted">탐색 검색 (강조)</span>
          <Button size="xs">검색</Button>
        </div>
        <div className="flex h-11 items-center gap-2.5 rounded-xl bg-field px-4 text-sm text-muted">
          다른 페이지 헤더 검색 (조용히)
        </div>
        <TextField aria-label="입력 기본" placeholder="입력 기본" />
        <TextField aria-label="오류" defaultValue="abc@" error="이메일 형식이 아니에요" />
      </Group>
      <Group title="칩 · 상태">
        <div className="flex flex-wrap gap-2">
          <Chip selected>선택된 칩</Chip>
          <Chip>기본 칩</Chip>
          <Chip tone="dark">동행 선택</Chip>
        </div>
        <div className="flex items-center gap-2">
          <StatusChip status="진행중" className="text-xs" />
          <StatusChip status="예정" className="text-xs" />
          <StatusChip status="종료" className="text-xs" />
          <DdayBadge>D-13</DdayBadge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SyncBadge state="synced" />
          <SyncBadge state="changed" />
          <SyncBadge state="none" />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border-[1.5px] border-warn px-[9px] py-[3px] text-xs font-semibold text-warn">
            기본 추천 코스
          </span>
          <WarningText>운영 시간 밖이에요</WarningText>
        </div>
        <div className="flex items-center gap-2">
          <IoLabel value="실내" />
          <IoLabel value="실외" />
          <IoLabel value="실내·실외" />
          <span className="text-xs text-sub">실내·실외 구분</span>
        </div>
      </Group>
      <Group title="표 행">
        <div className="grid grid-cols-[28px_minmax(0,1fr)_80px] items-center gap-3 rounded-[10px] px-3 py-2.5">
          <Checkbox size="sm" checked={false} label="기본" />
          <span className="text-[15px] font-semibold">기본</span>
          <span className="font-mono text-xs text-sub">10.24</span>
        </div>
        <div className="grid grid-cols-[28px_minmax(0,1fr)_80px] items-center gap-3 rounded-[10px] bg-[#F5F8FA] px-3 py-2.5">
          <Checkbox size="sm" checked={false} label="마우스 올림" />
          <span className="text-[15px] font-semibold">마우스 올림 → 지도 마커 강조</span>
          <span className="font-mono text-xs text-sub">10.24</span>
        </div>
        <div className="grid grid-cols-[28px_minmax(0,1fr)_80px] items-center gap-3 rounded-[10px] bg-sky-soft px-3 py-2.5 shadow-[inset_0_0_0_1.5px_var(--color-sky)]">
          <Checkbox size="sm" checked={checked} onCheckedChange={setChecked} label="선택 + 체크" />
          <span className="text-[15px] font-semibold">선택 + 체크</span>
          <span className="font-mono text-xs text-sub">10.24</span>
        </div>
        <div className="grid grid-cols-[28px_minmax(0,1fr)_80px] items-center gap-3 rounded-[10px] bg-warn-soft px-3 py-2.5 shadow-[inset_0_0_0_1px_#E3C68A]">
          <span className="text-center font-bold text-warn">▲</span>
          <span className="text-[15px] font-semibold">경고가 있는 행</span>
          <span className="font-mono text-xs text-sub">17:30</span>
        </div>
      </Group>
      <Group title="지도" wide>
        <div className="flex flex-wrap items-center gap-14">
          <div className="flex items-center gap-[18px]">
            {[
              [26, '#1E2420', ''],
              [32, '#1E9DEB', '0 0 0 6px rgba(30,157,235,.22)'],
              [36, '#1E9DEB', '0 0 0 6px rgba(30,157,235,.22),0 2px 8px rgba(30,36,32,.25)'],
            ].map(([size, bg, shadow]) => (
              <span
                key={String(size)}
                className="grid place-items-center rounded-full border-2 border-white font-mono text-xs font-semibold text-white"
                style={{
                  width: Number(size),
                  height: Number(size),
                  background: String(bg),
                  boxShadow: String(shadow) || undefined,
                }}
              >
                3
              </span>
            ))}
            <span className="text-[13px] text-sub">탐색 마커 기본 · 강조 · 선택</span>
          </div>
          <div className="flex items-center gap-2.5">
            {DAY_COLORS.map((c, i) => (
              <span
                key={c}
                className="grid size-7 place-items-center rounded-full border-2 border-white font-mono text-xs font-semibold text-white shadow-[0_2px_8px_rgba(30,36,32,.2)]"
                style={{ background: c }}
              >
                {i + 1}
              </span>
            ))}
            <span className="text-[13px] text-sub">코스 마커 = 일차 색 (1–4일차)</span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-sub">
            <span className="flex items-center gap-2">
              <span className="w-10 border-t-[3px] border-dotted border-day-1" />
              도보
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-10 bg-day-1" />
              대중교통
            </span>
            <span className="flex items-center gap-2">
              <span className="h-[7px] w-10 rounded bg-day-1" />
              택시
            </span>
            <span className="flex items-center gap-2">
              <span className="w-10 border-t-[2.5px] border-dashed border-muted" />
              임시 직선
            </span>
          </div>
          <StartMarker />
        </div>
      </Group>
    </main>
  )
}
