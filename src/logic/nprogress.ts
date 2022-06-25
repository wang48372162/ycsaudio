import type { Plugin } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import NProgress, { type NProgress as NProgressType } from 'nprogress'
import router from '@/router'
import 'nprogress/nprogress.css'

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
  nprogress.disableLoadedPageDone(route)
}

export default {
  install(app, options) {
    nprogress.configure(options)

    nprogress.disableLoadedPageDone = route => {
      route.meta.showProgressBar = false
    }

    router.beforeEach((to, from, next) => {
      nprogress.start()
      next()
    })

    router.afterEach(to => {
      const canBeDone = to.meta && typeof to.meta.showProgressBar === 'boolean'
        ? to.meta.showProgressBar
        : true

      if (canBeDone) nprogress.done()
    })
  },
} as Plugin
