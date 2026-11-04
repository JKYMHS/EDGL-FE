import { useState, type ReactNode } from 'react'
import { STYLE_PICK_MAX } from '@/features/onboarding/model/types'
import { travelStyles } from '@/mocks/data/member'
import { Button, Chip, Segmented, Toggle, Tray } from '@/shared/ui'

type Prefs = {
  styleIds: string[]
  pace: 'relaxed' | 'packed'
  timeOfDay: 'early' | 'morning' | 'afternoon'
  accessible: boolean
  pet: boolean
}

const FIELD_LABEL: Record<keyof Prefs, string> = {
  styleIds: '스타일',
  pace: '페이스',
  timeOfDay: '시간대',
  accessible: '이동 편의',
  pet: '반려동물',
}

/** 저장된 값과 디자인 13처럼 반려동물·스타일을 바꾼 상태 */
const SAVED: Prefs = {
  styleIds: ['culture', 'food'],
  pace: 'packed',
  timeOfDay: 'morning',
  accessible: false,
  pet: false,
}
const EDITED: Prefs = { ...SAVED, styleIds: ['culture', 'food', 'nature'], pet: true }

function changedFields(saved: Prefs, draft: Prefs) {
  const keys = Object.keys(saved) as (keyof Prefs)[]
  return keys
    .filter((k) => JSON.stringify(saved[k]) !== JSON.stringify(draft[k]))
    .sort((a, b) => (a === 'pet' ? -1 : b === 'pet' ? 1 : 0))
}

function Row({
  title,
  hint,
  children,
  aside,
}: {
  title: string
  hint: string
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <div
      className={
        aside
          ? 'grid grid-cols-[200px_minmax(0,1fr)_auto] items-center gap-6 border-t border-surface py-5'
          : 'grid grid-cols-[200px_minmax(0,1fr)] gap-6 border-t border-surface py-5'
      }
    >
      <div className="flex flex-col gap-[3px]">
        <span className="text-[15px] font-semibold">{title}</span>
        <span className="text-[13px] text-sub">{hint}</span>
      </div>
      {children}
      {aside}
    </div>
  )
}

/** 마이페이지 — 취향 설정 (디자인 13) · FUNC-001-14 */
export default function PreferencesPage() {
  const [saved, setSaved] = useState(SAVED)
  const [draft, setDraft] = useState(EDITED)
  const changed = changedFields(saved, draft)
  const update = (patch: Partial<Prefs>) => setDraft((d) => ({ ...d, ...patch }))
  const toggleStyle = (id: string) => {
    const on = draft.styleIds.includes(id)
    if (!on && draft.styleIds.length >= STYLE_PICK_MAX) return
    update({ styleIds: on ? draft.styleIds.filter((v) => v !== id) : [...draft.styleIds, id] })
  }

  return (
    <section className="flex max-w-[860px] flex-1 flex-col gap-1.5 overflow-y-auto px-14 py-8">
      <div className="flex flex-col gap-1 pb-4">
        <h1 className="text-2xl font-bold tracking-[-0.015em]">취향 설정</h1>
        <p className="text-sm text-sub">
          AI 추천과 정렬에 쓰여요. 바꾼 내용은 다음 추천부터 반영돼요.
        </p>
      </div>
      <Row title="여행 스타일" hint="1~3개 선택">
        <div className="flex flex-wrap gap-2">
          {travelStyles.map((s) => (
            <Chip
              key={s.id}
              selected={draft.styleIds.includes(s.id)}
              onClick={() => toggleStyle(s.id)}
              className="px-3.5 py-2 text-sm"
            >
              {s.name}
            </Chip>
          ))}
        </div>
      </Row>
      <Row title="페이스" hint="하루에 다닐 곳">
        <Segmented
          label="페이스"
          value={draft.pace}
          onChange={(pace) => update({ pace })}
          className="w-max self-start rounded-[10px]"
          items={[
            { value: 'relaxed', label: '여유롭게 · 2~3곳' },
            { value: 'packed', label: '알차게 · 4~5곳' },
          ]}
        />
      </Row>
      <Row title="선호 시간대" hint="첫 일정 시작">
        <Segmented
          label="선호 시간대"
          value={draft.timeOfDay}
          onChange={(timeOfDay) => update({ timeOfDay })}
          className="w-max self-start rounded-[10px]"
          items={[
            { value: 'early', label: '이른 아침' },
            {
              value: 'morning',
              label: (
                <>
                  오전 <span className="font-mono text-xs">10:00</span>
                </>
              ),
            },
            { value: 'afternoon', label: '점심 이후' },
          ]}
        />
      </Row>
      <Row
        title="이동 편의"
        hint="접근성"
        aside={
          <Toggle
            checked={draft.accessible}
            onCheckedChange={(accessible) => update({ accessible })}
            label="이동 편의"
          />
        }
      >
        <span className="text-sm text-[#3E4640]">계단이 적고 평탄한 길 위주로 짜기</span>
      </Row>
      <div className="border-b border-surface">
        <Row
          title="반려동물"
          hint="동반 가능 장소"
          aside={
            <Toggle
              checked={draft.pet}
              onCheckedChange={(pet) => update({ pet })}
              label="반려동물"
            />
          }
        >
          <span className="text-sm text-[#3E4640]">반려동물과 함께 갈 수 있는 곳만 추천</span>
        </Row>
      </div>
      {changed.length > 0 && (
        <Tray className="absolute right-14 bottom-8 w-[520px] gap-2.5 pl-[18px]">
          <span className="flex-1 text-[13px] text-sub">
            바뀐 항목 <span className="font-mono font-semibold text-ink">{changed.length}</span> ·{' '}
            {changed.map((k) => FIELD_LABEL[k]).join(', ')}
          </span>
          <Button variant="secondary" size="sm" className="px-3.5" onClick={() => setDraft(saved)}>
            되돌리기
          </Button>
          <Button size="sm" className="px-[18px]" onClick={() => setSaved(draft)}>
            저장
          </Button>
        </Tray>
      )}
    </section>
  )
}
