<template>
  <Layout>
    <Playlist v-bind="list" />
  </Layout>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate, type RouteLocationNormalized } from 'vue-router'
import { usePlaylist } from '@/logic/useList'
import { useTitle } from '@/logic/useTitle'
import { scrollToTop } from '@/logic/scrollToTop'

const route = useRoute()
const router = useRouter()
const { list, fetchListData } = usePlaylist()

function visit(route: RouteLocationNormalized) {
  fetchListData(route.params.playlist as string)

  if (!list.id) {
    router.push('/404')
  }

  useTitle(list.title)
  scrollToTop()
}

visit(route)

onBeforeRouteUpdate((to, from) => {
  visit(to)
})
</script>
