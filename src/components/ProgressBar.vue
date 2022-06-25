<template>
  <div ref="sliderRef"></div>
</template>

<script setup lang="ts">
import noUiSlider, { type API as Slider } from 'nouislider'
import 'nouislider/dist/nouislider.min.css'

const emit = defineEmits(['change', 'update'])

const props = defineProps<{
  value: number
  total: number
}>()

let slider: Slider
const sliderRef = ref<HTMLElement>(null!)
const is_drag = ref(false)

watch(() => props.value, value => {
  if (!is_drag.value) {
    slider.set(value > 0 ? value : 0)
  }
})

function listenTouchEvents() {
  useEventListener(sliderRef.value.querySelector('.noUi-handle'), 'mousedown', () => {
    is_drag.value = true
    useEventListener(document, 'mouseup', () => {
      is_drag.value = false
    }, { once: true })
  })

  useEventListener(sliderRef.value.querySelector('.noUi-handle'), 'touchstart', () => {
    is_drag.value = true
    useEventListener(document, 'touchend', () => {
      is_drag.value = false
    }, { once: true })
  })
}

onMounted(() => {
  slider = noUiSlider.create(sliderRef.value, {
    start: props.value,
    connect: [true, false],
    range: {
      min: 0,
      max: Math.floor(props.total),
    },
    animationDuration: 0,
  })

  slider.on('change', (values, handle) => {
    if (!props.total) return
    emit('change', parseFloat(values[0] as string))
  })

  slider.on('update', (values, handle) => {
    if (!props.total) return
    emit('update', parseFloat(values[0] as string))
  })

  listenTouchEvents()
})

onBeforeUnmount(() => {
  slider.destroy()
  slider = undefined!
})
</script>

<style lang="postcss" scoped>
.noUi-target {
  @apply h-7 rounded-none border-none bg-transparent shadow-none;
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
