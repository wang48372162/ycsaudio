import { useTitle as originUseTitle } from '@vueuse/core'
import type { Ref } from 'vue'

export function usePageTitle(newTitle: string | Ref<string>) {
  return originUseTitle(newTitle, { titleTemplate: '%s - ycsAudio' })
}
