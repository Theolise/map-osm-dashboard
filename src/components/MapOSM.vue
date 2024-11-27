<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import L, { LatLngExpression, LayerGroup, Map } from 'leaflet'

import { getMapData } from '@/services/overpassTurbo'
import { getPopupInfo, getQueryForArea } from '@/utils/osm'
import type { Area } from '@/types/areas'
import type { Element, Geometry, Member, Tag } from '@/types/osm'

const props = defineProps<{
  areas: Area[]
}>()

const map = ref<Map | null>(null)
const markersGroup = ref<LayerGroup | null>(null)

const queryAreas = computed<string>(() => {
  return getQueryForArea(props.areas)
})

const initMap = () => {
  map.value = L.map('map').setView([48.8566, 2.3522], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value as Map)

  markersGroup.value = L.layerGroup().addTo(map.value as Map)

  fetchOverpassData()
}

const fetchOverpassData = async () => {
  try {
    const data = await getMapData(queryAreas.value)

    if (map.value) {
      const nodes: Record<string, { lat: number | undefined; lon: number | undefined }> = {}
      const ways: Record<string, { coordinates: number[][]; tags: Tag }> = {}

      data.elements.forEach((element: Element) => {
        if (element.type === 'node') {
          nodes[element.id] = { lat: element.lat, lon: element.lon }
        } else if (element.type === 'way') {
          ways[element.id] = {
            coordinates: (element.geometry || []).map((geo: Geometry) => [geo.lat, geo.lon]),
            tags: element.tags,
          }
        } else if (element.type === 'relation') {
          const outerRing = []
          const innerRing = []

          element.members?.forEach((member: Member) => {
            if (member.role == 'outer' && member.type == 'way') {
              outerRing.push(member.geometry.map((geo: Geometry) => [geo.lat, geo.lon]))
            } else if (member.role == 'inner' && member.type == 'way') {
              innerRing.push(member.geometry.map((geo: Geometry) => [geo.lat, geo.lon]))
            }
          })
          ways[element.id] = { coordinates: [outerRing, innerRing], tags: element.tags }
        }
      })

      if (markersGroup.value) {
        markersGroup.value.clearLayers()
      }

      for (const [key, way] of Object.entries(ways)) {
        const polygon = L.polygon(way.coordinates as LatLngExpression[], {
          color: 'green',
          fillColor: '#228B22',
          fillOpacity: 0.5,
        }).bindPopup(getPopupInfo(key, way.tags))
        markersGroup.value.addLayer(polygon)
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données Overpass:', error)
  }
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <div style="width: 70%">
    <div id="map" style="height: 500px; width: 100%; border-radius: 20px"></div>
  </div>
</template>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
