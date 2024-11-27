export type SavedStat = {
  data: number[]
  labels: string[]
  timestamp: number
}

export type ChartData = {
  labels: string[]
  datasets: DataSet[]
}

type DataSet = {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  borderWidth: number
}

export type ArrondissementDetail = {
  label: string
  shortLabel: string
  wikidata: string
}
