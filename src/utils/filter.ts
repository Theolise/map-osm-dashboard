import type { Area } from '@/types/areas'

export const isSelected = (filter: Area, areasSelected: Area[]) => {
  return areasSelected.some(
    (selected) => selected.type === filter.type && selected.label === filter.label,
  )
}
