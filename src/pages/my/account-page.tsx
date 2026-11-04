import { useState } from 'react'
import { accountDemo } from '@/mocks/data/member'
import { Button, ConfirmDialog, SettingsRow, Toggle } from '@/shared/ui'
import { MySection } from './my-section'

type Consents = typeof accountDemo.consents

const CONSENTS: { key: keyof Consents; title: string; text: string }[] = [
  { key: 'location', title: '위치 정보 이용', text: '현재 위치를 출발지로 쓸 때' },
  { key: 'behavior', title: '행동 데이터 수집·이용', text: '찜·조회·여행 기록으로 추천을 맞춰요' },
  { key: 'emailAlert', title: '이메일 알림 수신', text: '다녀온 여행의 방문 확인 메일' },
]

/** 마이페이지 — 계정 (시안 C-1) · FUNC-001-04 구글 연결, 001-15 동의 설정 */
export default function AccountPage() {
  const [consents, setConsents] = useState(accountDemo.consents)
  const [googleLinked, setGoogleLinked] = useState(accountDemo.google.linked)
  const [confirmBehaviorOff, setConfirmBehaviorOff] = useState(false)

  const change = (key: keyof Consents, on: boolean) => {
    // 행동 데이터를 끄면 기존 데이터가 지워지므로 먼저 묻는다 (001-15)
    if (key === 'behavior' && !on) return setConfirmBehaviorOff(true)
    setConsents((c) => ({ ...c, [key]: on }))
  }

  return (
    <MySection title="계정" description="로그인 정보와 정보 이용 동의를 관리해요.">
      <SettingsRow title="이메일" hint="로그인 아이디">
        <span className="text-[15px]">{accountDemo.email}</span>
      </SettingsRow>
      <SettingsRow
        title="이름"
        hint="화면에 보이는 이름"
        aside={
          <Button variant="secondary" size="xs">
            바꾸기
          </Button>
        }
      >
        <span className="text-[15px]">{accountDemo.name}</span>
      </SettingsRow>
      <SettingsRow
        title="구글 계정"
        hint="구글로도 로그인"
        aside={
          googleLinked ? (
            <Button variant="secondary" size="xs" onClick={() => setGoogleLinked(false)}>
              연결 해제
            </Button>
          ) : (
            <Button variant="soft" size="xs" onClick={() => setGoogleLinked(true)}>
              구글 계정 연결
            </Button>
          )
        }
      >
        {googleLinked ? (
          <span className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-field text-[13px] font-bold text-[#4285F4]">
              G
            </span>
            <span className="text-sm">{accountDemo.google.email}</span>
            <span className="rounded-md bg-done-soft px-[9px] py-[3px] text-xs font-semibold text-done">
              ● 연결됨
            </span>
          </span>
        ) : (
          <span className="text-sm text-sub">연결된 구글 계정이 없어요</span>
        )}
      </SettingsRow>

      <h2 className="mt-7 pb-1.5 text-[15px] font-bold">정보 이용 동의</h2>
      <div className="border-b border-surface">
        {CONSENTS.map((c) => (
          <SettingsRow
            key={c.key}
            title={c.title}
            hint="선택"
            aside={
              <Toggle
                checked={consents[c.key]}
                onCheckedChange={(on) => change(c.key, on)}
                label={c.title}
              />
            }
          >
            <span className="text-sm text-[#3E4640]">{c.text}</span>
          </SettingsRow>
        ))}
      </div>
      <p className="mt-3.5 text-[13px] text-sub">
        필수 동의(만 14세 이상, 이용약관, 개인정보 수집·이용)는 철회할 수 없어요. 원하지 않으면{' '}
        <b className="font-semibold text-error">회원 탈퇴</b>를 해 주세요.
      </p>

      <ConfirmDialog
        open={confirmBehaviorOff}
        onOpenChange={setConfirmBehaviorOff}
        className="w-[460px]"
        title="행동 데이터 수집을 끌까요?"
        description={
          <>
            지금까지 모은 찜·조회·여행 기록 기반 데이터가 <b className="text-ink">삭제</b>되고,
            추천이 덜 정확해질 수 있어요.
          </>
        }
        cancelLabel="그대로 두기"
        confirmLabel="끄고 삭제하기"
        onConfirm={() => {
          setConsents((c) => ({ ...c, behavior: false }))
          setConfirmBehaviorOff(false)
        }}
      />
    </MySection>
  )
}
