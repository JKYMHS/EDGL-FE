/** 디자인이 아직 없는 화면·단계 자리 (PRD 6.2 "디자인이 없는 화면") */
export function NotDesigned({ name }: { name: string }) {
  return (
    <div className="grid flex-1 place-items-center p-10">
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line-strong px-10 py-8 text-center">
        <p className="text-base font-bold">{name}</p>
        <p className="text-sm text-sub">디자인이 나오면 만들 화면이에요.</p>
      </div>
    </div>
  )
}
