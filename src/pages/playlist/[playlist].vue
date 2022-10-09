<template>
  <Layout>
    <Playlist v-bind="list" />
  </Layout>
</template>

<script setup lang="ts">
import { type RouteLocationNormalized, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const { list, fetchListData } = usePlaylist()

function visit(route: RouteLocationNormalized, isUpdate = false) {
  fetchListData(route.params.playlist as string)

  usePageTitle(list.title, { isUpdate })
  scrollToTop()
}

visit(route)

onBeforeRouteUpdate((to, from) => {
  visit(to, true)
})
</script>
