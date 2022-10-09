<template>
  <Layout>
    <Player
      v-bind="audio"
      :list-id="list.id"
      @before-load="loadStart"
      @loaded="loadEnd"
    />

    <Playlist v-if="list.id" class="mt-6" v-bind="list" />
  </Layout>
</template>

<script setup lang="ts">
import { type RouteLocationNormalized, onBeforeRouteUpdate } from 'vue-router'
import { loadEnd, loadStart } from '@/logic/nprogress'

const route = useRoute()

const { audio, fetchAudioData } = useAudio()
const { list, fetchListData } = usePlaylist()

function visit(route: RouteLocationNormalized, isUpdate = false) {
  disableLoadedPageDone(route)

  fetchAudioData(route.params.audio as string)
  fetchListData(route.query.list as string)

  usePageTitle(audio.title, { isUpdate })
  scrollToTop()
}

visit(route)

onBeforeRouteUpdate((to, from) => {
  visit(to, true)
})
</script>
