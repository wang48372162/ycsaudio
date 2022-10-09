<template>
  <ProgressBar
    name="player"
    :value="currentTime"
    :total="total"
    @change="changeProgress"
    @update="changeRealtimeProgress"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  currentTime: number
  duration: number
  step?: number
}>(), { step: 5 })

const emit = defineEmits(['change', 'changeRealtime'])

const total = 60 * 60

const currentTime = computed(() => {
  if (!props.duration) {
    return 0
  }
  return Math.floor((props.currentTime / props.duration) * total)
})

function forward() {
  emit('change', props.currentTime + props.step)
}

function backward() {
  emit('change', props.currentTime - props.step)
}

function changeProgress(value: number) {
  emit('change', Math.floor((value / total) * props.duration))
}

function changeRealtimeProgress(value: number) {
  emit('changeRealtime', Math.floor((value / total) * props.duration))
}

const { ArrowLeft, ArrowRight } = useMagicKeys()

wheneverOnSearchBoxClosed(ArrowLeft, backward)
wheneverOnSearchBoxClosed(ArrowRight, forward)
</script>
