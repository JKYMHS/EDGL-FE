import { CornerDownLeft, X } from 'lucide-react'
import { Fragment, useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router'
import { autocompleteGroups, recentSearches, searchSuggestionChips } from '@/mocks/data/search'
import { cn } from '@/shared/lib/cn'
import { DdayBadge, SearchMark } from '@/shared/ui'

/** 검색어와 같은 부분을 하늘색으로 강조한다 */
function highlight(text: string, query: string): ReactNode {
  const q = query.trim()
  const at = q ? text.indexOf(q) : -1
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent text-sky-text">{q}</mark>
      {text.slice(at + q.length)}
    </>
  )
}

/** 검색 시작 (디자인 03-5 첫 화면, 03-6 자동완성) · FUNC-002-07 */
export default function SearchStartPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const typing = query.trim().length > 0

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(typing ? `/explore?q=${encodeURIComponent(query.trim())}` : '/explore')
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center justify-end gap-7 px-8 text-sm font-semibold text-sub">
        <NavLink to="/recommend" className="hover:text-ink">
          AI 추천
        </NavLink>
        <NavLink to="/trips" className="hover:text-ink">
          내 여행
        </NavLink>
        <NavLink to="/likes" className="hover:text-ink">
          찜
        </NavLink>
        <Link
          to="/my/preferences"
          aria-label="마이페이지"
          className="size-[34px] rounded-full bg-map"
        />
      </header>
      <main className="flex flex-1 flex-col items-center gap-7 pt-[170px]">
        <h1 className="text-[64px] leading-none font-extrabold tracking-[-0.04em]">어디 갈래</h1>
        <form
          role="search"
          onSubmit={submit}
          className={cn(
            'w-[680px] overflow-hidden rounded-[30px] border bg-white transition-shadow',
            typing
              ? 'border-line shadow-[0_6px_24px_rgba(30,36,32,.16)]'
              : 'border-map shadow-[0_2px_10px_rgba(30,36,32,.08)] focus-within:border-sky-line focus-within:shadow-[0_4px_18px_rgba(30,157,235,.18)]',
          )}
        >
          <div
            className={cn(
              'flex h-[58px] items-center gap-3.5 pr-2 pl-6',
              typing && 'border-b border-surface',
            )}
          >
            <SearchMark active={typing} className="size-4" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="축제, 관광지, 지역 이름으로 찾기"
              placeholder="축제, 관광지, 지역 이름으로 찾기"
              className="h-full min-w-0 flex-1 bg-transparent text-[17px] caret-sky outline-none placeholder:text-muted"
            />
            {typing && (
              <button
                type="button"
                aria-label="지우기"
                onClick={() => setQuery('')}
                className="px-2 text-muted"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="grid h-11 place-items-center rounded-[22px] bg-sky px-[22px] text-[15px] font-semibold text-white"
            >
              검색
            </button>
          </div>
          {typing && (
            <>
              <div role="listbox" aria-label="자동완성" className="flex flex-col pt-2 pb-2.5">
                {autocompleteGroups.map((group, gi) => (
                  <Fragment key={group.label}>
                    <span
                      className={cn(
                        'px-6 pt-2 pb-1 text-xs font-bold text-sub',
                        gi > 0 && 'mt-1.5 border-t border-surface pt-3',
                      )}
                    >
                      {group.label}
                    </span>
                    {group.items.map((item, ii) => {
                      const active = gi === 0 && ii === 0
                      return (
                        <Link
                          key={item.id}
                          role="option"
                          aria-selected={active}
                          to={`/explore?q=${encodeURIComponent(item.title)}`}
                          className={cn(
                            'grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3.5 px-6 py-2 hover:bg-[#F5F8FA]',
                            active && 'bg-[#F5F8FA]',
                          )}
                        >
                          <span
                            className="grid h-[34px] w-11 place-items-center rounded-[7px] text-[13px] text-sub"
                            style={{ background: item.thumb }}
                          >
                            {item.icon && '◎'}
                          </span>
                          <span className="flex flex-col gap-px">
                            <span className="text-[15px] font-semibold">
                              {highlight(item.title, query)}
                              {item.note && (
                                <span className="ml-1 text-xs font-medium text-sub">
                                  {highlight(item.note, query)}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-sub">
                              {item.meta}
                              {item.metaMono && <span className="font-mono">{item.metaMono}</span>}
                            </span>
                          </span>
                          {item.dday ? (
                            <DdayBadge className="rounded-[5px] px-[7px] py-0.5 text-[11px]">
                              {item.dday}
                            </DdayBadge>
                          ) : active ? (
                            <CornerDownLeft size={12} className="text-muted" />
                          ) : (
                            <span />
                          )}
                        </Link>
                      )
                    })}
                  </Fragment>
                ))}
              </div>
              <div className="flex h-10 items-center justify-between border-t border-surface bg-[#F8FAFB] px-6 text-xs text-muted">
                <span>
                  <span className="font-mono">↑↓</span> 이동 · <span className="font-mono">↵</span>{' '}
                  탐색에서 보기
                </span>
                <span>최근 검색: {recentSearches.join(', ')}</span>
              </div>
            </>
          )}
        </form>
        {!typing && (
          <div className="flex gap-2">
            {searchSuggestionChips.map((chip) => (
              <Link
                key={chip}
                to={`/explore?chip=${encodeURIComponent(chip)}`}
                className="rounded-full bg-field px-3.5 py-2 text-sm font-semibold hover:bg-surface"
              >
                {chip}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
