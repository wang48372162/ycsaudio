<template>
  <Layout>
    <Playlist v-bind="list" />
  </Layout>
</template>

<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router'

const route = useRoute()
const { list, fetchListData } = usePlaylist()

usePageTitle(() => list.title)

function visit(route: RouteLocationNormalized) {
  fetchListData(route.params.playlist as string)

  scrollToTop()
}

visit(route)

onBeforeRouteUpdate((to, _from) => {
  visit(to)
})
</script>
