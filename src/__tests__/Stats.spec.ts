import { cleanup, render, screen } from '@testing-library/vue'
import Stats from '@/components/Stats.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/charts/Bar.vue', () => ({
  default: {
    template: '<div data-testid="bar-chart"></div>',
  },
}))

vi.mock('@/components/charts/Doughnut.vue', () => ({
  default: {
    template: '<div data-testid="doughnut-chart"></div>',
  },
}))

vi.mock('@/utils/stats', () => ({
  isDataValid: vi.fn(),
  loadAndCacheData: vi.fn(),
}))

describe('Stats', () => {
  beforeEach(() => {
    cleanup()
    vi.resetAllMocks()
  })

  it('displays loaders when no valid data is in localStorage', async () => {
    const { isDataValid, loadAndCacheData } = await import('@/utils/stats')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    isDataValid.mockReturnValue(false)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loadAndCacheData.mockResolvedValue({
      labels: [],
      data: [],
    })

    render(Stats)

    const loaders = await screen.findAllByTestId('loader')
    expect(loaders).toHaveLength(2)
  })

  it('displays charts when valid data is in localStorage', async () => {
    const mockData = {
      labels: new Array(20).fill('label'),
      data: [10, 20],
    }
    const { isDataValid, loadAndCacheData } = await import('@/utils/stats')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    isDataValid.mockReturnValue(true)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loadAndCacheData.mockImplementation(async () => {
      return mockData
    })

    render(Stats)

    const barChart = await screen.findByTestId('bar-chart')
    const doughnutChart = await screen.findByTestId('doughnut-chart')

    expect(barChart).toBeTruthy()
    expect(doughnutChart).toBeTruthy()
    expect(screen.queryByTestId('loader')).toBeNull()
  })
})
