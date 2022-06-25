<template>
  <div class="card">
    <RouterLink :to="listTitleTo" class="block py-3 px-5 text-xl">
      {{ title }}
    </RouterLink>

    <ul class="divide-y divide-gray-200">
      <li v-for="audio in audioList" :key="audio.id">
        <RouterLink
          :to="audioTo(audio.id)"
          class="block py-3 px-5 hover:bg-gray-50"
          :class="isActiveLink(audio.id) ? '' : ''"
        >
          {{ audio.title }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Audio } from '@/composables/useAudio'

const props = defineProps<{
  id: string
  title: string
  audios: number[]
}>()

const route = useRoute()

const listTitleTo = computed(() => ({
  name: 'playlist-playlist',
  params: {
    playlist: props.id,
  },
}))

const audioList = computed(() => props.audios.map(getAudio) as Audio[])

function isActiveLink(id: number) {
  return id === Number(route.params.audio)
}

function audioTo(audioId: number) {
  return {
    name: 'audio-audio',
    params: { audio: audioId },
    query: { list: props.id },
  }
}
</script>
