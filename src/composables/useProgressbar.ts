import { computed, reactive } from 'vue'

const isDragMapping = reactive({}) as Record<string, boolean>

export function useProgressbar(name: string) {
  if (typeof isDragMapping[name] !== 'boolean') {
    isDragMapping[name] = false
  }

  const isDrag = computed(() => isDragMapping[name])
  const setDrag = (value: boolean) => {
    isDragMapping[name] = value
  }

  return { isDrag, setDrag }
}
