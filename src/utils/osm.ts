import type { Area } from '@/types/areas'
import type { Tag } from '@/types/osm'

export const getQueryForArea = (areas: Area[]) => {
  let query = `
    [out:json];
    area["wikidata"="Q90"]->.searchArea;
    (`

  if (areas.length > 0) {
    const grouped = areas?.reduce(
      (acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = []
        }
        acc[item.type].push(item.label)
        return acc
      },
      {} as Record<string, string[]>,
    )

    Object.entries(grouped).forEach(([type, labels]) => {
      if (labels.length > 1) {
        query += `way["${type}"~"${labels.join('|')}"](area.searchArea);`
        query += `relation["${type}"~"${labels.join('|')}"](area.searchArea);`
      } else {
        query += `way["${type}"="${labels[0]}"](area.searchArea);`
        query += `relation["${type}"="${labels[0]}"](area.searchArea);`
      }
    })
  }

  query += `);
    out geom;
  `
  return query
}

export const getPopupInfo = (id: string, tags: Tag) => {
  let detail = ''
  for (const [key, tag] of Object.entries(tags)) {
    if (displayTag(key)) {
      detail += `${key}: ${tag} <br />`
    }
  }
  return `ID : ${id} <br /> ${detail}`
}

const displayTag = (keyTag: string) => {
  if (keyTag.includes(':')) {
    return false
  }
  if (keyTag == 'image') {
    return false
  }

  return true
}
