import type { RouteRecordRaw } from 'vue-router'
import { ViteSSG } from 'vite-ssg'
import routes from '~pages'
import App from '@/App.vue'
import { getAudios, getLists } from '@/logic/audio'
import type { UserModule } from '@/types'
import 'nprogress/nprogress.css'
import 'tippy.js/dist/tippy.css'
import './styles/index.css'

export const createApp = ViteSSG(App, {
  routes,
  base: import.meta.env.BASE_URL,
}, ctx => {
  // install all modules under `modules/`
  Object
    .values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
    .forEach(i => i.install?.(ctx))
})

export function includedRoutes(paths: string[], routes: Readonly<RouteRecordRaw[]>) {
  return routes
    .flatMap<string>(route => {
      if (route.path === '/audio/:audio') {
        return getAudios().map(({ id }) => `/audio/${id}`)
      }

      if (route.path === '/playlist/:playlist') {
        return getLists().map(({ id }) => `/playlist/${id}`)
      }

      if (route.path === '/:all(.*)*') {
        return '/404'
      }

      return route.path
    })
}
