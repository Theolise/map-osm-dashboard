import type { ResponseOverpassTurbo } from '@/types/osm'

export const getMapData = async (query: string): Promise<ResponseOverpassTurbo> => {
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  const response = await fetch(url)
  return response.json()
}
