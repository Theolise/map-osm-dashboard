import { vi } from 'vitest'

const mockMapInstance = {
  setView: vi.fn().mockReturnThis(),
  on: vi.fn(),
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  getBounds: vi.fn().mockReturnValue({
    getNorthEast: () => ({ lat: 48.9, lng: 2.4 }),
    getSouthWest: () => ({ lat: 48.8, lng: 2.3 }),
  }),
  getZoom: vi.fn().mockReturnValue(13),
}

const mockLayerGroup = {
  addTo: vi.fn().mockReturnThis(),
  clearLayers: vi.fn(),
  addLayer: vi.fn(),
}

const mockLatLngExpression = [48.8566, 2.3522] // Exemple de coordonnées

const L = {
  map: vi.fn(() => mockMapInstance),
  tileLayer: vi.fn(() => ({
    addTo: vi.fn(),
  })),
  layerGroup: vi.fn(() => mockLayerGroup),
  marker: vi.fn(() => ({
    bindPopup: vi.fn().mockReturnThis(),
    addTo: vi.fn(),
  })),
  polygon: vi.fn(() => ({
    bindPopup: vi.fn().mockReturnThis(),
  })),
  LatLngExpression: mockLatLngExpression,
  LayerGroup: vi.fn(() => mockLayerGroup),
  Map: vi.fn(() => mockMapInstance),
}

export default L
