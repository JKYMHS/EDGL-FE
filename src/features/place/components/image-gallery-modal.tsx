import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Modal } from '@/shared/ui'

/** 이미지 자리 색 (TourAPI 이미지가 들어오기 전) */
const TONES = ['#DCE3E8', '#E3E8EC', '#D6DEE4', '#E8ECEF']

/** 상세 이미지 갤러리 (FUNC-002-04). ←·→ 키로도 넘긴다 */
export function ImageGalleryModal({
  open,
  onOpenChange,
  title,
  count,
  index,
  onIndexChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  count: number
  index: number
  onIndexChange: (index: number) => void
}) {
  const go = (i: number) => onIndexChange((i + count) % count)
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      closeButton
      title={title}
      description={
        <span className="font-mono text-sm" aria-live="polite">
          {index + 1} / {count}
        </span>
      }
      className="w-[880px] gap-4 rounded-[20px]"
    >
      <div
        className="relative"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(index - 1)
          if (e.key === 'ArrowRight') go(index + 1)
        }}
      >
        <div
          role="img"
          aria-label={`${title} 사진 ${index + 1}`}
          className="grid h-[460px] place-items-center rounded-[14px] text-sm text-sub"
          style={{ background: TONES[index % TONES.length] }}
        >
          사진 {index + 1}
        </div>
        <button
          type="button"
          aria-label="이전 사진"
          onClick={() => go(index - 1)}
          className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow hover:bg-white"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="다음 사진"
          onClick={() => go(index + 1)}
          className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow hover:bg-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto p-1">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`사진 ${i + 1} 보기`}
            aria-current={i === index || undefined}
            onClick={() => onIndexChange(i)}
            className={cn(
              'h-14 w-20 shrink-0 rounded-lg',
              i === index ? 'ring-2 ring-sky ring-offset-2' : 'opacity-70 hover:opacity-100',
            )}
            style={{ background: TONES[i % TONES.length] }}
          />
        ))}
      </div>
    </Modal>
  )
}
