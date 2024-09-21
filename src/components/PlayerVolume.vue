<template>
  <div class="flex items-center">
    <button
      v-tippy="'靜音 (M)'"
      class="mr-2 inline-block h-6 w-6 opacity-90 transition duration-200 sm:hover:opacity-100"
      data-test="volume-muted"
      @click="mute"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path class="transition-[d] duration-200" :d="volumeIconPath" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </button>

    <div v-tippy="`音量：${volume}%`" class="w-[50px]">
      <ProgressBar
        name="volume"
        :value="volume"
        :total="total"
        @update="updateVolume"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  volume?: number
  muted?: boolean
  step?: number
}>(), {
  volume: 100,
  muted: false,
  step: 10,
})

const emit = defineEmits<{
  change: [volume: number]
  muted: [muted: boolean]
}>()

const total = 100

const volumeIconPath = computed(() => {
  if (props.muted) {
    return 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'
  } else if (props.volume > 60) {
    return 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
  } else if (props.volume <= 60 && props.volume > 0) {
    return 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z'
  }
  return 'M7 9v6h4l5 5V4l-5 5H7z'
})

function volumeUp() {
  updateVolume(props.volume + props.step)
}

function volumeDown() {
  updateVolume(props.volume - props.step)
}

function mute() {
  changeMuted(!props.muted)
}

function updateVolume(value: number) {
  if (value < 0) {
    value = 0
  } else if (value > total) {
    value = total
  }

  emit('change', value)
}

function changeMuted(value: boolean) {
  emit('muted', value)
}

onKeyDownWhenSearchBoxClosed('ArrowUp', volumeUp)
onKeyDownWhenSearchBoxClosed('ArrowDown', volumeDown)
onKeyDownWhenSearchBoxClosed(['M', 'm'], mute)
</script>
