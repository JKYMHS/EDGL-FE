import type { ContentItem } from './types'

/** ids 순서대로 항목을 고른다. 없는 id는 건너뛴다. */
export function pickByIds<T extends ContentItem>(items: T[], ids: string[]): T[] {
  return ids.flatMap((id) => items.find((item) => item.id === id) ?? [])
}

export function likedIdsOf(items: ContentItem[]) {
  return items.filter((item) => item.liked).map((item) => item.id)
}
