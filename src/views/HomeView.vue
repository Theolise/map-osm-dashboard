<script setup lang="ts">
import { ref } from 'vue'

import { AREAS } from '@/constants/areas'
import type { Area } from '@/types/areas'

import MapOSM from '@/components/MapOSM.vue'

const areasSelected = ref(AREAS)

const isSelected = (filter: Area) => {
  return areasSelected.value.some(
    (selected) => selected.type === filter.type && selected.label === filter.label,
  )
}

const toggleFilter = (filter: Area) => {
  if (isSelected(filter)) {
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

        <div>
          <div class="filters">
            <span class="title">Types of areas</span>
            <div v-for="(filter, index) in AREAS" :key="index" class="checkbox">
              <label>
                <input
                  type="checkbox"
                  :value="filter"
                  :checked="isSelected(filter)"
                  @change="toggleFilter(filter)"
                />
                <span class="checkmark"></span>
                {{ filter.label }}
              </label>
            </div>
          </div>
        </div>
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

      .filters {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .title {
          padding-bottom: 5px;
        }

        .checkbox {
          display: flex;

          label {
            display: flex;
            align-items: center;
            gap: 5px;
          }

          input {
            display: none;
          }
          .checkmark {
            display: block;
            border: 1px solid #e14eca;
            width: 10px;
            height: 10px;
            border-radius: 1px;
          }
        }

        .checkbox:hover input ~ .checkmark {
          background-color: #ed9ee0;
        }
        .checkbox input:checked ~ .checkmark {
          background-color: #e14eca;
        }
      }
    }
  }
}
</style>
