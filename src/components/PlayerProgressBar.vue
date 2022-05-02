<template>
  <ProgressBar :value="currentTime" :total="total" @change="updateProgress" />
</template>

<script setup lang="ts">
const emit = defineEmits(['change'])

const props = withDefaults(
  defineProps<{
    currentTime: number
    duration: number
    step?: number
  }>(),
  { step: 5 }
)

const total = 3600

const currentTime = computed(() =>
  props.duration ? Math.floor((props.currentTime / props.duration) * total) : 0
)

function forward() {
  emit('change', props.currentTime + props.step)
}

function backward() {
  emit('change', props.currentTime - props.step)
}

function updateProgress(value: number) {
  emit('change', Math.floor((value / total) * props.duration))
}

const { ArrowLeft, ArrowRight } = useMagicKeys()

whenever(ArrowLeft, backward)
whenever(ArrowRight, forward)
</script>
