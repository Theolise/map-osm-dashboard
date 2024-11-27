import { vi } from 'vitest'
vi.mock('leaflet', () => import('./src/__mocks__/leaflet.ts'))
