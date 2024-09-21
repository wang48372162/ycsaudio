<template>
  <div class="select-none">
    {{ currentTime }} / {{ duration }}
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  duration: number
  currentTime: number
}>(), {
  duration: 0,
  currentTime: 0,
})

const duration = computed(() => formatTime(props.duration))
const currentTime = computed(() => formatTime(props.currentTime))

function formatTime(duration: number) {
  if (Number.isNaN(duration)) duration = 0

  const s = Math.floor(duration % 60).toString().padStart(2, '0')
  const m = Math.floor((duration / 60) % 60).toString().padStart(2, '0')

  return `${m}:${s}`
}
</script>
