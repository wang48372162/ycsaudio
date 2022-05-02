<template>
  <Layout>
    <Player v-bind="audio" :list-id="list.id" @before-load="loadStart" @loaded="loadEnd" />

    <Playlist v-if="list.id" class="mt-6" v-bind="list" />
  </Layout>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate, type RouteLocationNormalized } from 'vue-router'
import { useAudio } from '@/logic/useAudio'
import { usePlaylist } from '@/logic/useList'
import { useTitle } from '@/logic/useTitle'
import { loadStart, loadEnd, disableLoadedPageDone } from '@/logic/nprogress'
import { scrollToTop } from '@/logic/scrollToTop'

const route = useRoute()
const router = useRouter()

const { audio, fetchAudioData } = useAudio()
const { list, fetchListData } = usePlaylist()

function visit(route: RouteLocationNormalized) {
  disableLoadedPageDone(route)

  fetchAudioData(route.params.audio as string)
  fetchListData(route.query.list as string)

  if (!audio.id) router.push('/404')

  useTitle(audio.title)
  scrollToTop()
}

visit(route)

onBeforeRouteUpdate((to, from) => {
  visit(to)
})
</script>
