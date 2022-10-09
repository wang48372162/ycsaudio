import type { UserModule } from '@/types'
import { nprogress } from '@/logic/nprogress'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    nprogress.disableLoadedPageDone = route => {
      route.meta.showProgressBar = false
    }

    router.beforeEach((to, from, next) => {
      nprogress.start()
      next()
    })

    router.afterEach(to => {
      const canBeDone =
        typeof to.meta.showProgressBar === 'boolean'
          ? to.meta.showProgressBar
          : true

      if (canBeDone) {
        nprogress.done()
      }
    })
  }
}
