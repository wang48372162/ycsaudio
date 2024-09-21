import { useHead } from '@unhead/vue'
import type { MaybeComputedRef } from '@unhead/vue'

interface UsePageTitleOptions {
  titleTemplate?: string
}

export function usePageTitle(title: MaybeComputedRef<string>, options: UsePageTitleOptions = {}) {
  const {
    titleTemplate = '%s - ycsAudio',
  } = options

  useHead({
    title,
    titleTemplate,
  })
}
