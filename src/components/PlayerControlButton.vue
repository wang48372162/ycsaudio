<template>
  <Component
    :is="tag"
    :to="to"
    class="h-[50px] w-[50px] opacity-90 transition duration-200 sm:hover:opacity-100"
    :class="classes"
    :title="title"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="currentColor"
    >
      <path class="transition-[d] duration-200" :d="svgPath" />
    </svg>
  </Component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type: 'link' | 'button'
    svgPath: string
    title?: string
    to?: object
    lighten?: boolean
    disabled?: boolean
  }>(),
  {
    lighten: false,
    disabled: false,
  }
)

const tag = computed(() =>
  props.type === 'button' ? 'button' : props.type === 'link' && props.to ? 'RouterLink' : 'div'
)

const classes = computed(() => [
  props.disabled
    ? 'text-gray-300 cursor-default !opacity-90'
    : props.lighten
      ? 'text-gray-400'
      : 'text-gray-700',
])
</script>
