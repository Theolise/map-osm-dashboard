import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'

import { AREAS } from '@/constants/areas'

import MapOSM from '@/components/MapOSM.vue'

describe('MapOSM', () => {
  it('renders properly the map', async () => {
    render(MapOSM, { props: { areas: AREAS } })
    screen.debug()
    expect(screen.queryByTestId('map')).toBeTruthy()
  })
})
