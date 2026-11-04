import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { BulkUploadModal } from '@/features/calendar'
import { bulkFailures, bulkTrips, calendarLink, unconfirmedTripTitle } from '@/mocks/data/calendar'
import { Button, ConfirmDialog, RadioMark, SyncBadge } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { MySection } from './my-section'

/** 마이페이지 — 캘린더 연동 (시안 C-2) → 연동 직후 일괄 업로드 (D-1, D-2) · FUNC-005-01, 02 */
export default function CalendarPage() {
  const [params] = useSearchParams()
  const [linked, setLinked] = useState(params.get('state') !== 'disconnected')
  const [bulkOpen, setBulkOpen] = useState(params.get('modal') === 'bulk')
  const [unlinkOpen, setUnlinkOpen] = useState(false)
  const [keepEvents, setKeepEvents] = useState(true)

  return (
    <MySection
      title="캘린더 연동"
      description="확정한 일정안을 구글 캘린더에 올리고, 바뀌면 자동으로 맞춰요."
    >
      {linked ? (
        <div className="mt-2 rounded-xl shadow-[inset_0_0_0_1px_var(--color-line)]">
          <div className="flex items-center gap-3.5 border-b border-surface px-6 py-5">
            <span className="size-10 rounded-[10px] border border-line bg-field" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-semibold">{calendarLink.email}</span>
              <span className="text-xs font-semibold text-done">
                ● 연동됨 · {calendarLink.linkedSince}부터
              </span>
            </span>
            <Button variant="secondary" size="xs" onClick={() => setUnlinkOpen(true)}>
              연동 해제
            </Button>
          </div>
          <div className="grid grid-cols-[180px_1fr_auto] items-center gap-4 border-b border-surface px-6 py-4">
            <span className="text-sm font-semibold">기본 캘린더</span>
            <span className="text-[13px] text-sub">새 여행을 올릴 때 먼저 골라 둬요</span>
            <select
              aria-label="기본 캘린더"
              defaultValue={calendarLink.defaultCalendar}
              className="h-9 rounded-[9px] border border-line px-3 text-[13px] font-semibold"
            >
              {calendarLink.calendars.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-[180px_1fr] items-center gap-4 px-6 py-4">
            <span className="text-sm font-semibold">올라간 여행</span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-sub">
              {calendarLink.syncedTrips.map((t) => (
                <span key={t.title} className="flex items-center gap-1.5">
                  {t.title}
                  <SyncBadge state={t.sync} />
                </span>
              ))}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-[18px] rounded-xl px-6 py-[22px] shadow-[inset_0_0_0_1px_var(--color-line)]">
          <span className="grid size-12 place-items-center rounded-xl border border-line bg-field font-mono text-[13px] font-bold text-sub">
            31
          </span>
          <span className="flex flex-1 flex-col gap-[3px]">
            <span className="text-base font-semibold">구글 캘린더가 연결되지 않았어요</span>
            <span className="text-[13px] text-sub">
              일정 등록·수정과 캘린더 목록 읽기 권한을 요청해요
            </span>
          </span>
          <Button
            size="sm"
            onClick={() => {
              setLinked(true)
              setBulkOpen(true)
            }}
          >
            구글 캘린더 연결
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={unlinkOpen}
        onOpenChange={setUnlinkOpen}
        className="w-[480px]"
        title="캘린더 연동을 해제할까요?"
        description={
          <>
            이미 올린 일정 <b className="font-mono text-ink">{calendarLink.uploadedEvents}</b>개를
            어떻게 할까요?
          </>
        }
        tone="danger"
        confirmLabel="연동 해제"
        onConfirm={() => {
          setLinked(false)
          setUnlinkOpen(false)
        }}
      >
        <div role="radiogroup" aria-label="올린 일정 처리" className="flex flex-col gap-2">
          {[
            {
              keep: true,
              title: '캘린더에 그대로 두기',
              hint: '앞으로 바뀌는 내용만 반영되지 않아요',
            },
            {
              keep: false,
              title: '캘린더에서 모두 지우기',
              hint: '어디 갈래가 올린 일정만 지워요',
            },
          ].map((o) => (
            <button
              key={o.title}
              type="button"
              role="radio"
              aria-checked={keepEvents === o.keep}
              onClick={() => setKeepEvents(o.keep)}
              className={cn(
                'flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left',
                keepEvents === o.keep
                  ? 'bg-sky-soft shadow-[inset_0_0_0_1.5px_var(--color-sky)]'
                  : 'shadow-[inset_0_0_0_1px_var(--color-line)]',
              )}
            >
              <RadioMark checked={keepEvents === o.keep} />
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold">{o.title}</span>
                <span className="text-[13px] text-sub">{o.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </ConfirmDialog>

      {bulkOpen && (
        <BulkUploadModal
          open
          onOpenChange={setBulkOpen}
          account={calendarLink.email}
          trips={bulkTrips}
          unconfirmedTitle={unconfirmedTripTitle}
          calendars={calendarLink.calendars}
          failures={bulkFailures}
        />
      )}
    </MySection>
  )
}
