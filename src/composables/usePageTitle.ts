import type { Ref } from 'vue'
import { useTitle } from '@vueuse/core'
import { useHead } from '@vueuse/head'

interface UsePageTitleOptions {
  titleTemplate?: string
  isUpdate?: boolean
}

export function usePageTitle(newTitle: string | Ref<string>, options: UsePageTitleOptions = {}) {
  const {
    titleTemplate = '%s - ycsAudio',
    isUpdate = false,
  } = options

  if (isUpdate) {
    useTitle(newTitle, {
      titleTemplate,
    })
  } else {
    useHead({
      title: newTitle,
      titleTemplate,
    })
  }
}
