import { onKeyDown } from '@vueuse/core'
import type { KeyFilter, OnKeyStrokeOptions } from '@vueuse/core'
import { showSearchBox } from '@/state'

export function onKeyDownWhenSearchBoxClosed(
  key: KeyFilter,
  handler: (event: KeyboardEvent) => void,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>,
) {
  onKeyDown(key, e => {
    if (!showSearchBox.value) {
      e.preventDefault()
      handler(e)
    }
  }, options)
}
