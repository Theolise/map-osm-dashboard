export type Element = {
  id: string
  type: string
  lat?: number
  lon?: number
  geometry?: Geometry[]
  bounds?: Bound
  members?: Member[]
  tags: Tag
}

export type Geometry = {
  lat: number
  lon: number
}

export type Bound = {
  maxlat: number
  maxlon: number
  minlat: number
  minlon: number
}

export type Member = {
  geometry: Geometry[]
  ref: number
  role: 'inner' | 'outer'
  type: string
}

export type Tag = Record<string, string>

export type ResponseOverpassTurbo = {
  elements: Element[]
  generator: string
  osm3s: Record<string, string>
  version: number
}
