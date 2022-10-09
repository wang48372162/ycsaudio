import { watch } from 'vue'
import type { WatchCallback, WatchOptions, WatchSource } from 'vue'
import { showSearchBox } from '@/state'

export function wheneverOnSearchBoxClosed<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: WatchOptions) {
  return watch(source, (v, ov, onInvalidate) => {
    if (v && !showSearchBox.value) {
      cb(v, ov, onInvalidate)
    }
  }, options)
}
