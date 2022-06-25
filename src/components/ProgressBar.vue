<template>
  <div ref="sliderRef" />
</template>

<script setup lang="ts">
import noUiSlider, { type API as Slider } from 'nouislider'
import 'nouislider/dist/nouislider.min.css'

const props = defineProps<{
  name: string
  value: number
  total: number
}>()

const emit = defineEmits(['change', 'update'])

let slider: Slider
const sliderRef = ref<HTMLElement>(null!)
const { isDrag, setDrag } = useProgressbar(props.name)

function mountSlider() {
  slider = noUiSlider.create(sliderRef.value, {
    start: props.value,
    behaviour: 'snap',
    connect: [true, false],
    range: {
      min: 0,
      max: Math.floor(props.total),
    },
    animationDuration: 0,
    keyboardSupport: false,
  })

  slider.on('change', (values, handle) => {
    if (!props.total) return
    emit('change', parseFloat(`${values[0]}`))
  })

  slider.on('update', (values, handle) => {
    if (!props.total) return
    emit('update', parseFloat(`${values[0]}`))
  })

  listenTouchEvents()
}

function unmountSlider() {
  slider.destroy()
  slider = undefined!
}

function listenTouchEvents() {
  const eventMap = {
    '.noUi-base': [
      ['mousedown', 'mouseup'],
    ],
    '.noUi-handle': [
      ['mousedown', 'mouseup'],
      ['touchstart', 'touchend'],
    ],
  } as Record<string, [string, string][]>

  for (const el of Object.keys(eventMap)) {
    for (const [startEvent, endEvent] of eventMap[el]) {
      useEventListener(sliderRef.value.querySelector(el), startEvent, () => {
        setDrag(true)
        useEventListener(document, endEvent, () => {
          setDrag(false)
        }, { once: true })
      })
    }
  }
}

watch(() => props.value, value => {
  // 拖曳時不更新時間
  if (!isDrag.value) {
    slider.set(value > 0 ? value : 0)
  }
})

onMounted(mountSlider)
onBeforeUnmount(unmountSlider)
</script>

<style scoped>
.noUi-target {
  @apply h-7 bg-transparent border-none rounded-none shadow-none cursor-pointer;
  @apply before:absolute before:inset-0 before:my-3 before:block before:bg-gray-300;
}

:deep(.noUi-base) {
  @apply py-3;
}

:deep(.noUi-connects) {
  @apply bg-gray-200;
}

:deep(.noUi-connect) {
  @apply bg-black;
}

:deep(.noUi-handle) {
  @apply top-[6px] -right-2 h-4 w-4 cursor-pointer rounded-full border-none bg-black shadow-none;
  @apply before:hidden after:hidden;
}

:deep(.noUi-touch-area) {
  @apply absolute -top-1 -bottom-1 -left-1 -right-1 h-auto w-auto;
}
</style>
