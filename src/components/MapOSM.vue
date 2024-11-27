<script setup lang="ts">
import { ref, onMounted, computed, watch, toRef } from 'vue'
import L, { type LatLngExpression, LayerGroup, Map } from 'leaflet'

import { getMapData } from '@/services/overpassTurbo'
import { getPopupInfo, getQueryForArea, getQueryForTreeByBounds } from '@/utils/osm'
import type { Area } from '@/types/areas'
import type { Element, Geometry, Member, Tag } from '@/types/osm'

const props = defineProps<{
  areas: Area[]
}>()

const debounceDelayFilters = 1500
const minZoomToShowTrees = 17
const debounceDelayUpdateTree = 300

const map = ref<Map | null>(null)
const markersGroupArea = ref<LayerGroup | null>(null)
const markersGroupTree = ref<LayerGroup | null>(null)
const loading = ref<boolean>(false)

const areasRef = toRef(props, 'areas')

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

const queryAreas = computed<string>(() => {
  return getQueryForArea(props.areas)
})

const initMap = () => {
  map.value = L.map('map').setView([48.8566, 2.3522], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value as Map)

  markersGroupArea.value = L.layerGroup().addTo(map.value as Map)
  markersGroupTree.value = L.layerGroup().addTo(map.value as Map)

  map.value.on('moveend', handleMapChange)
  map.value.on('zoomend', handleMapChange)

  fetchAreaData()
}

const fetchTreeData = async (bounds: L.LatLngBounds): Promise<Element[]> => {
  loading.value = true
  const data = await getMapData(getQueryForTreeByBounds(bounds))
  return data.elements
}

const updateTreeMarkers = async () => {
  if (!map.value || map.value.getZoom() < minZoomToShowTrees) {
    if (markersGroupTree.value) markersGroupTree.value.clearLayers()
    loading.value = false
    return
  }

  const bounds = map.value.getBounds()

  try {
    const trees = await fetchTreeData(bounds)
    if (markersGroupTree.value) markersGroupTree.value.clearLayers()

    const treeIcon = L.icon({
      iconUrl: 'tree.svg',

      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    })

    trees.forEach((tree: Element) => {
      if (tree.lat && tree.lon) {
        const marker = L.marker([tree.lat, tree.lon], { icon: treeIcon }).bindPopup(
          getPopupInfo(tree.id, tree.tags),
        )
        markersGroupTree.value?.addLayer(marker)
      }
    })
    loading.value = false
  } catch (error) {
    console.error('Erreur lors de la récupération des arbres :', error)
  }
}

const fetchAreaData = async () => {
  try {
    loading.value = true
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const outerRing = []
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const innerRing = []

          element.members?.forEach((member: Member) => {
            if (member.role == 'outer' && member.type == 'way') {
              outerRing.push(member.geometry.map((geo: Geometry) => [geo.lat, geo.lon]))
            } else if (member.role == 'inner' && member.type == 'way') {
              innerRing.push(member.geometry.map((geo: Geometry) => [geo.lat, geo.lon]))
            }
          })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ways[element.id] = { coordinates: [outerRing, innerRing], tags: element.tags }
        }
      })

      if (markersGroupArea.value) {
        markersGroupArea.value.clearLayers()
      }

      for (const [key, way] of Object.entries(ways)) {
        const polygon = L.polygon(way.coordinates as LatLngExpression[], {
          color: 'green',
          fillColor: '#228B22',
          fillOpacity: 0.5,
        }).bindPopup(getPopupInfo(key, way.tags))
        markersGroupArea.value?.addLayer(polygon)
      }
    }
    loading.value = false
  } catch (error) {
    console.error('Erreur lors de la récupération des données Overpass:', error)
  }
}

const handleMapChange = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    updateTreeMarkers()
  }, debounceDelayUpdateTree)
}

onMounted(() => {
  initMap()
})

watch(areasRef, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchAreaData()
  }, debounceDelayFilters)
})
</script>

<template>
  <div style="width: 70%">
    <div id="map" style="height: 500px; width: 100%; border-radius: 20px"></div>
    <div class="info-container">
      <p class="info">Zoomer sur la carte pour charger les arbres de la zone sélectionnée</p>
      <p v-if="loading">Chargement ...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#map {
  height: 100%;
  width: 100%;
}

.info-container {
  display: flex;
  align-items: center;
  gap: 20px;

  .info {
    position: relative;
    width: fit-content;
    font-size: 14px;
    padding: 12px 20px;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    color: #084298;
    background-color: #cfe2ff;
    border-color: #b6d4fe;
    text-align: center;
  }
}
</style>
