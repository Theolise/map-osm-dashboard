<script setup lang="ts">
import HomeView from '@/views/HomeView.vue'
</script>

<template>
  <header>
    <img alt="leaf logo" src="`/leaf.svg`" width="20" height="20" />
    <p>VégétationInTheCity</p>
  </header>

  <HomeView />
</template>

<style scoped>
header {
  padding: 0px 20px;
  width: 100%;
  border-bottom: 1px solid white;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
