<script setup lang="ts">
import { AREAS } from '@/constants/areas'
import type { Area } from '@/types/areas'
import { isSelected } from '@/utils/filter'

defineProps<{
  areas: Area[]
}>()
</script>

<template>
  <div class="filters">
    <span class="title">Types d'espaces verts</span>
    <div v-for="(filter, index) in AREAS" :key="index" class="checkbox">
      <label>
        <input
          type="checkbox"
          :value="filter"
          :checked="isSelected(filter, areas)"
          @change="$emit('toggleFilter', filter)"
        />
        <span class="checkmark"></span>
        {{ filter.label }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
</style>
