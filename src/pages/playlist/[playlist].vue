<template>
  <Layout>
    <Playlist v-bind="list" />
  </Layout>
</template>

<script setup lang="ts">
import { type RouteLocationNormalized, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { list, fetchListData } = usePlaylist()

function visit(route: RouteLocationNormalized) {
  fetchListData(route.params.playlist as string)

  if (!list.id) {
    router.push('/404')
  }

  usePageTitle(list.title)
  scrollToTop()
}

visit(route)

onBeforeRouteUpdate((to, from) => {
  visit(to)
})
</script>
