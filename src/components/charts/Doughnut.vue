<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

import type { ChartData } from '@/types/stats'

ChartJS.register(ArcElement, Tooltip, Legend)
ChartJS.defaults.color = '#FFFFFF'

defineProps<{
  data: ChartData
}>()
</script>

<template>
  <Doughnut :data="data" />
</template>
