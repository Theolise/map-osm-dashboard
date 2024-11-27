<script setup lang="ts">
import { ref } from 'vue'

import { AREAS } from '@/constants/areas'

import MapOSM from '@/components/MapOSM.vue'

const areasSelected = ref(AREAS)
</script>

<template>
  <main>
    <h2>Espaces verts et arbres</h2>

    <div class="dashboard">
      <div class="map">
        <MapOSM :areas="areasSelected" />
      </div>
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
