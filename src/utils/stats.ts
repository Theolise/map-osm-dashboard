import type { SavedStat } from '@/types/stats'

const EXPIRATION_TIME = 24 * 60 * 60 * 1000

export const isDataValid = (savedData: SavedStat) => {
  if (!savedData || !savedData.timestamp) {
    return false
  }
  return Date.now() - savedData.timestamp < EXPIRATION_TIME
}
