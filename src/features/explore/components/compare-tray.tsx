import { Button, PanelTray, Pill } from '@/shared/ui'
import type { ContentItem } from '../model/types'

/** 비교 트레이: "비교 N" + 담은 곳 + 다음 행동 (디자인 04, 06). 개수 제한 없음 (PRD 6.3) */
export function CompareTray({
  items,
  onRemove,
  actionLabel,
  onAction,
}: {
  items: ContentItem[]
  onRemove: (id: string) => void
  actionLabel: string
  onAction: () => void
}) {
  return (
    <PanelTray className="pl-[18px]">
      <span className="text-[13px] font-semibold whitespace-nowrap">
        비교 <span className="font-mono">{items.length}</span>
      </span>
      <div className="flex min-w-0 flex-1 gap-1.5 overflow-hidden">
        {items.map((item) => (
          <Pill key={item.id} onRemove={() => onRemove(item.id)}>
            {item.name}
          </Pill>
        ))}
      </div>
      <Button size="sm" disabled={items.length === 0} onClick={onAction}>
        {actionLabel}
      </Button>
    </PanelTray>
  )
}
