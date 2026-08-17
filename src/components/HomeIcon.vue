<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->
<template>
  <svg
    :class="['home-icon', sizeClass]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  >
    <path stroke-linecap="round" stroke-linejoin="round" :d="icons[name]" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const icons = {
  arrowRight: 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3',
  book: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  copy: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  check: 'M4.5 12.75l6 6 9-13.5',
  server: 'M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z',
  sync: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232-.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
} as const

const props = withDefaults(defineProps<{
  name: keyof typeof icons
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
}>(), { size: 'md', strokeWidth: 1.5 })

const sizeClass = computed(() => ({
  xs: 'home-icon--xs',
  sm: 'home-icon--sm',
  md: 'home-icon--md',
  lg: 'home-icon--lg',
  xl: 'home-icon--xl',
}[props.size]))
</script>

<style scoped>
.home-icon {
  display: block;
  flex: 0 0 auto;
}

.home-icon--xs { width: 12px; height: 12px; }
.home-icon--sm { width: 16px; height: 16px; }
.home-icon--md { width: 20px; height: 20px; }
.home-icon--lg { width: 24px; height: 24px; }
.home-icon--xl { width: 32px; height: 32px; }
</style>
