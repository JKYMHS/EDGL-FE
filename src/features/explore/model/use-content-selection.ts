import { useState } from 'react'

type Defaults = {
  selectedId?: string
  hoverId?: string
  compareIds?: string[]
  likedIds?: string[]
}

/** 표·지도에서 공유하는 선택 상태: 선택한 행, 마우스 올린 행, 비교 목록, 찜 (PRD 6.1 표 + 지도) */
export function useContentSelection(defaults: Defaults) {
  const [selectedId, setSelectedId] = useState(defaults.selectedId)
  const [hoverId, setHoverId] = useState(defaults.hoverId)
  const [compareIds, setCompareIds] = useState(defaults.compareIds ?? [])
  const [likedIds, setLikedIds] = useState(defaults.likedIds ?? [])

  const toggle = (list: string[], id: string) =>
    list.includes(id) ? list.filter((v) => v !== id) : [...list, id]

  return {
    selectedId,
    hoverId,
    compareIds,
    likedIds,
    select: setSelectedId,
    hover: setHoverId,
    toggleCompare: (id: string) => setCompareIds((list) => toggle(list, id)),
    removeCompare: (id: string) => setCompareIds((list) => list.filter((v) => v !== id)),
    toggleLike: (id: string) => setLikedIds((list) => toggle(list, id)),
  }
}

export type ContentSelection = ReturnType<typeof useContentSelection>
