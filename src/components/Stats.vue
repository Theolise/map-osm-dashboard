<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { AREAS } from '@/constants/areas'
import { arrondissementsParis } from '@/constants/wikidata'
import { getMapData } from '@/services/overpassTurbo'
import type { Area } from '@/types/areas'
import type { ArrondissementDetail, ChartData } from '@/types/stats'
import { getQueryForArea, getQueryForTreeByWikidata } from '@/utils/osm'
import { loadAndCacheData } from '@/utils/stats'
import { isDataValid } from '@/utils/stats'

import Bar from '@/components/charts/Bar.vue'
import Doughnut from '@/components/charts/Doughnut.vue'
import Loader from '@/components/Loader.vue'

const STORAGE_KEY_TREE = 'treeByArrondissement'
const STORAGE_KEY_AREA = 'areaByTypeCount'

const treeByArrondissement = ref<ChartData>({
  labels: [],
  datasets: [
    {
      label: 'Number of tree by arrondissement',
      data: [],
      borderColor: '#FF4870',
      backgroundColor: '#FFA3B7',
      borderWidth: 1,
    },
  ],
})
const areaByTypeCount = ref<ChartData>({
  labels: [],
  datasets: [
    {
      label: 'Areas repartition by type',
      backgroundColor: [],
      data: [] as number[],
    },
  ],
})

const getTreeByArrondissement = async (arrondissement: ArrondissementDetail) => {
  const data = await getMapData(getQueryForTreeByWikidata(arrondissement.wikidata))
  return {
    label: arrondissement.shortLabel,
    count: data.elements.length,
  }
}

const getAreaByTypeCount = async (area: Area) => {
  const data = await getMapData(getQueryForArea([area]))
  return {
    label: area.label,
    count: data.elements.length,
  }
}

const loadTreeData = async () => {
  const data = await loadAndCacheData(STORAGE_KEY_TREE, isDataValid, async () => {
    const labels: string[] = []
    const data: number[] = []

    for (const arrondissement of arrondissementsParis) {
      const result = await getTreeByArrondissement(arrondissement)
      labels.push(result.label)
      data.push(result.count)
    }

    return { labels, data }
  })

  treeByArrondissement.value.labels = data.labels
  treeByArrondissement.value.datasets[0].data = data.data
}

const loadAreaData = async () => {
  const data = await loadAndCacheData(STORAGE_KEY_AREA, isDataValid, async () => {
    const labels: string[] = []
    const backgroundColor: string[] = []
    const data: number[] = []

    for (const area of AREAS) {
      const result = await getAreaByTypeCount(area)
      labels.push(result.label)
      backgroundColor.push(area.color)
      data.push(result.count)
    }

    return { labels, data, backgroundColor }
  })

  areaByTypeCount.value.labels = data.labels
  areaByTypeCount.value.datasets[0].backgroundColor = data.backgroundColor || []
  areaByTypeCount.value.datasets[0].data = data.data
}

onMounted(() => {
  loadTreeData()
  loadAreaData()
})
</script>

<template>
  <div class="stats">
    <div class="card">
      <span>Nombre d'arbres par arrondissement</span>
      <Bar
        v-if="treeByArrondissement.labels.length === arrondissementsParis.length"
        :data="treeByArrondissement"
      />
      <div v-else class="loader-container">
        <Loader />
      </div>
    </div>
    <div class="card">
      <span>Répartition des espaces verts par type</span>
      <Doughnut v-if="areaByTypeCount.labels.length > 0" :data="areaByTypeCount" />
      <div v-else class="loader-container">
        <Loader />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stats {
  margin-top: 40px;
  display: flex;
  gap: 10px;

  .card {
    flex: 1;
    min-height: 300px;
    max-height: 500px;
    padding: 16px;
    background-color: #4f4f54;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 18px;

    canvas {
      height: auto;
      max-height: 350px;
    }

    .loader-container {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
