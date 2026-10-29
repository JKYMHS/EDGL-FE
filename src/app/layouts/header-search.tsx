import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { SearchMark } from '@/shared/ui'

/** 헤더 검색창. 탐색·상세에서는 강조, 다른 화면에서는 조용한 스타일 (PRD 6.1) */
export function HeaderSearch({ emphasized }: { emphasized: boolean }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/explore?q=${encodeURIComponent(q.trim())}` : '/explore')
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        'flex max-w-[620px] flex-1 items-center gap-2.5',
        emphasized
          ? 'h-12 rounded-[14px] border-2 border-sky pr-1.5 pl-4 shadow-[0_4px_14px_rgba(30,157,235,.12)]'
          : 'h-11 rounded-xl bg-field px-4',
      )}
    >
      <SearchMark active={emphasized} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="축제, 관광지, 지역 검색"
        placeholder="축제, 관광지, 지역 이름"
        className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
      />
      {emphasized && (
        <button
          type="submit"
          className="grid h-9 place-items-center rounded-[10px] bg-sky px-4 text-sm font-semibold text-white"
        >
          검색
        </button>
      )}
    </form>
  )
}
