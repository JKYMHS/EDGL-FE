import type { ReactNode } from 'react'

/** 마이페이지 오른쪽 본문 틀: 제목 + 설명 + 내용 (디자인 13) */
export function MySection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="flex max-w-[860px] flex-1 flex-col gap-1.5 overflow-y-auto px-14 py-8">
      <div className="flex flex-col gap-1 pb-4">
        <h1 className="text-2xl font-bold tracking-[-0.015em]">{title}</h1>
        <p className="text-sm text-sub">{description}</p>
      </div>
      {children}
    </section>
  )
}
