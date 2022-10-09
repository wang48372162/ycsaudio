import type { RouteLocationNormalized } from 'vue-router'
import NProgress, { type NProgress as NProgressType } from 'nprogress'

export const nprogress = NProgress as NProgressType & {
  disableLoadedPageDone(route: RouteLocationNormalized): void
}

export function loadStart() {
  nprogress.start()
}

export function loadEnd() {
  nprogress.done()
}

export function disableLoadedPageDone(route: RouteLocationNormalized) {
  if ('disableLoadedPageDone' in nprogress) {
    nprogress.disableLoadedPageDone(route)
  }
}
