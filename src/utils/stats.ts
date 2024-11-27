import type { SavedStat } from '@/types/stats'

const EXPIRATION_TIME = 24 * 60 * 60 * 1000

export const isDataValid = (savedData: SavedStat) => {
  if (!savedData || !savedData.timestamp) {
    return false
  }
  return Date.now() - savedData.timestamp < EXPIRATION_TIME
}

export const loadAndCacheData = async (
  storageKey: string,
  isValid: (data: SavedStat) => boolean,
  loadFn: () => Promise<{ labels: string[]; data: number[]; backgroundColor?: string[] }>,
): Promise<{ labels: string[]; data: number[]; backgroundColor?: string[] }> => {
  const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}') as SavedStat

  if (isValid(savedData)) {
    return savedData
  }

  const newData = await loadFn()
  localStorage.setItem(storageKey, JSON.stringify({ ...newData, timestamp: Date.now() }))
  return newData
}
