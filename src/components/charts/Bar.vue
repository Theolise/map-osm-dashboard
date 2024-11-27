<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

import type { ChartData } from '@/types/stats'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.defaults.color = '#FFFFFF'

defineProps<{
  data: ChartData
}>()
</script>

<template>
  <Bar :data="data" />
</template>
