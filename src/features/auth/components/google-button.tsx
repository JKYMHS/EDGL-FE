import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'

/** "Google로 계속하기" 버튼 (01, 14-1). 구글 로고 자리는 디자인처럼 회색 원으로 둔다. */
export function GoogleButton({ className }: { className?: string }) {
  return (
    <Button variant="secondary" size="xl" className={cn('w-full gap-2.5 text-[15px]', className)}>
      <span aria-hidden className="size-[18px] rounded-full border border-line bg-field" />
      Google로 계속하기
    </Button>
  )
}
