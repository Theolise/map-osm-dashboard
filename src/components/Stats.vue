<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { arrondissementsParis } from '@/constants/wikidata'
import { getMapData } from '@/services/overpassTurbo'
import type { ArrondissementDetail } from '@/types/stats'
import { getQueryForTreeByWikidata } from '@/utils/osm'
import { isDataValid } from '@/utils/stats'

import Loader from '@/components/Loader.vue'
import Bar from '@/components/charts/Bar.vue'
import { type ChartData, type SavedStat } from '@/types/stats'

const STORAGE_KEY_TREE = 'treeByArrondissement'

const treeByArrondissement = ref<ChartData>({
  labels: [],
  datasets: [
    {
      label: "Nombre d'arbres par arrondissement",
      data: [],
      borderColor: '#FF4870',
      backgroundColor: '#FFA3B7',
      borderWidth: 1,
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

const loadTreeData = async () => {
  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TREE) || '{}') as SavedStat

  if (isDataValid(savedData)) {
    treeByArrondissement.value.labels = savedData.labels
    treeByArrondissement.value.datasets[0].data = savedData.data
  } else {
    const labels = []
    const data = []

    for (const arrondissement of arrondissementsParis) {
      const result = await getTreeByArrondissement(arrondissement)
      labels.push(result.label)
      data.push(result.count)
    }

    treeByArrondissement.value.labels = labels
    treeByArrondissement.value.datasets[0].data = data

    localStorage.setItem(STORAGE_KEY_TREE, JSON.stringify({ labels, data, timestamp: Date.now() }))
  }
}

onMounted(() => {
  loadTreeData()
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
      <Loader v-else />
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
  }
}
</style>
