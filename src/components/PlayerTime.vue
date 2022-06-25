<template>
  <div class="select-none">
    {{ currentTimeText }} / {{ durationText }}
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    duration: number
    currentTime: number
  }>(),
  {
    duration: 0,
    currentTime: 0,
  }
)

const durationText = computed(() => timeFormet(props.duration))
const currentTimeText = computed(() => timeFormet(props.currentTime))

function timeFormet(duration: number) {
  duration = !isNaN(duration) ? duration : 0
  const s = timeNumFormet(Math.floor(duration % 60))
  const m = timeNumFormet(Math.floor((duration / 60) % 60))
  return `${m}:${s}`
}

function timeNumFormet(number: number) {
  let result = `${number}`
  for (let i = String(number).length; i < 2; i++) {
    result = `0${number}`
  }
  return result
}
</script>
