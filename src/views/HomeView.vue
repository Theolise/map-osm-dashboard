<script setup lang="ts">
import { ref } from 'vue'

import { AREAS } from '@/constants/areas'
import type { Area } from '@/types/areas'
import { isSelected } from '@/utils/filter'

import Filters from '@/components/Filters.vue'
import MapOSM from '@/components/MapOSM.vue'
import Stats from '@/components/Stats.vue'

const areasSelected = ref(AREAS)

const toggleFilter = (filter: Area) => {
  if (isSelected(filter, areasSelected.value)) {
    areasSelected.value = areasSelected.value.filter(
      (selected) => selected.type !== filter.type || selected.label !== filter.label,
    )
  } else {
    areasSelected.value = [...areasSelected.value, filter]
  }
}
</script>

<template>
  <main>
    <h2>Espaces verts et arbres</h2>

    <div class="dashboard">
      <div class="map">
        <MapOSM :areas="areasSelected" />

        <Filters :areas="areasSelected" @toggle-filter="toggleFilter" />
      </div>

      <Stats />
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 30px;

    .map {
      display: flex;
      gap: 20px;
    }
  }
}
</style>
