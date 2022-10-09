<template>
  <div class="relative ml-3 inline-block">
    <Float as="template" :show="show" placement="bottom-end" :offset="8" :transform="false">
      <button
        type="button"
        class="absolute bottom-0 left-0 p-1"
        title="搜尋 (Enter)"
        @click="show = !show"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </button>

      <div class="pfixed inset-0 bg-white p-4 sm:static sm:inset-auto sm:w-[288px] sm:shadow">
        <h2 class="mb-5 text-center text-2xl font-bold">
          搜尋
        </h2>
        <input
          ref="searchRef"
          v-model="search"
          class="search-input w-full rounded-sm border border-gray-600 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
          type="text"
          placeholder="搜尋..."
          @keydown.prevent.down="searchKeydown"
          @keydown.prevent.up="searchKeyup"
          @keydown.enter="searchEnter"
        >

        <button
          type="button"
          class="absolute top-4 right-4 sm:hidden"
          title="關閉 (Escape)"
          @click="show = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>

        <div
          v-if="result"
          ref="searchResult"
          class="-mx-4 mt-4 -mb-4 max-h-[400px] overflow-y-auto"
        >
          <template v-if="result.audios.length">
            <h3 class="px-4 pb-2 text-xl font-bold">
              歌曲：
            </h3>
            <ul class="mb-2">
              <li
                v-for="(audio, i) in result.audios"
                :key="audio.id"
                :ref="el => searchResultAudiosRefs[i] = el as HTMLElement"
              >
                <RouterLink
                  :to="audioTo(audio.id)"
                  class="block px-4 py-2"
                  :class="i === selectAudioIndex ? 'bg-black text-white' : 'hover:bg-gray-100'"
                  @click="onClickLink"
                >
                  {{ audio.title }}
                  <RouterLink
                    v-if="currentList && audioListTo(audio.id)"
                    :to="audioTo(audio.id, true)"
                    class="whitespace-nowrap rounded px-1 text-sm"
                    :class="i === selectAudioIndex ? 'bg-white text-black' : 'bg-black text-white'"
                    @click="onClickLink"
                  >
                    {{ currentList.name }}
                  </RouterLink>
                </RouterLink>
              </li>
            </ul>
          </template>

          <template v-if="result.lists.length">
            <h3 class="px-4 pb-2 text-xl font-bold">
              播放清單：
            </h3>
            <ul class="mb-2">
              <li
                v-for="(list, i) in result.lists"
                :key="list.id"
                :ref="el => searchResultListsRefs[i] = el as HTMLElement"
              >
                <RouterLink
                  :to="listTo(list.id)"
                  class="block px-4 py-2"
                  :class="i === selectListIndex ? 'bg-black text-white' : 'hover:bg-gray-100'"
                  @click="onClickLink"
                >
                  {{ list.name }}
                </RouterLink>
              </li>
            </ul>
          </template>

          <div v-if="resultEmpty" class="px-4 py-2 text-center text-gray-400">
            搜尋不到任何歌曲或播放清單...
          </div>
        </div>
      </div>
    </Float>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { onKeyDown } from '@vueuse/core'

const route = useRoute()
const router = useRouter()

const show = ref(false)
const search = ref('')
const selectIndex = ref<number | null>(null)

const searchRef = ref(null!) as Ref<HTMLElement>
const searchResultAudiosRefs = ref([]) as Ref<HTMLElement[]>
const searchResultListsRefs = ref([]) as Ref<HTMLElement[]>

const result = computed(() => {
  if (!search.value) return

  const audios = getAudios().filter(audio => {
    return searchText(search.value, audio.title)
  })

  const lists = getLists().filter(list => {
    return searchText(search.value, list.name)
  })

  return { audios, lists }
})

const resultEmpty = computed(() => {
  if (!result.value) {
    return true
  }

  return !result.value.audios.length && !result.value.lists.length
})

const selectAudioIndex = computed(() => {
  if (!result.value) return null
  if (selectIndex.value === null) return null
  if (selectIndex.value >= result.value.audios.length) return null

  return selectIndex.value
})

const selectAudio = computed(() => {
  if (!result.value) return null
  if (selectAudioIndex.value === null) return null

  return result.value.audios[selectAudioIndex.value]
})

const selectAudioEl = computed(() => {
  if (selectAudioIndex.value === null) return null

  return searchResultAudiosRefs.value[selectAudioIndex.value]
})

const selectListIndex = computed(() => {
  if (!result.value) return null
  if (selectIndex.value === null) return null
  if (selectIndex.value < result.value.audios.length) return null

  return selectIndex.value - result.value.audios.length
})

const selectList = computed(() => {
  if (!result.value) return null
  if (selectListIndex.value === null) return null

  return result.value.lists[selectListIndex.value]
})

const selectListEl = computed(() => {
  if (selectListIndex.value === null) return null

  return searchResultListsRefs.value[selectListIndex.value]
})

const queryListId = computed(() =>
  route.name === 'playlist'
    ? (route.params.playlist as string | null)
    : (route.query?.list as string | null)
)

const currentList = computed(() => (queryListId.value ? getList(queryListId.value) : null))

const selectLinkRoute = computed(() => {
  if (!result.value) {
    return null
  } else if (selectAudio.value) {
    return audioTo(selectAudio.value.id)
  } else if (selectList.value) {
    return listTo(selectList.value.id)
  }
  return null
})

function searchText(key: string, text: string) {
  return text.toLowerCase().includes(key.toLowerCase())
}

function selectScrollIntoView() {
  if (selectAudioEl.value) {
    selectAudioEl.value.scrollIntoView({ block: 'nearest' })
  } else if (selectListEl.value) {
    selectListEl.value.scrollIntoView({ block: 'nearest' })
  }
}

function audioListTo(audioId: number) {
  return listContainAudio(queryListId.value, audioId) ? queryListId.value : null
}

function audioTo(id: number, withList = false) {
  const list = audioListTo(id)
  return {
    name: 'audio-audio',
    params: { audio: id },
    query: list && withList ? { list } : {},
  }
}

function listTo(listId: string) {
  return {
    name: 'playlist-playlist',
    params: { playlist: listId },
  }
}

function onClickLink() {
  show.value = false
  search.value = ''
  selectIndex.value = null
}

function searchEnter() {
  const targetRoute = selectLinkRoute.value
  if (selectIndex.value !== null && targetRoute) {
    onClickLink()
    router.push(targetRoute)
  }
}

function searchKeydown() {
  if (!result.value) {
    return null
  }

  const resultsLength = result.value.audios.length + result.value.lists.length
  if (selectIndex.value === null) {
    selectIndex.value = 0
  } else if (selectIndex.value < resultsLength - 1) {
    selectIndex.value++
  }

  selectScrollIntoView()
}

function searchKeyup() {
  if (!result.value || selectIndex.value === null) {
    return null
  }

  if (selectIndex.value > 0) {
    selectIndex.value--
  }

  selectScrollIntoView()
}

watch(show, show => {
  if (show) nextTick(() => searchRef.value?.focus())
})

watch(search, search => {
  if (search === '' || search === null || !result.value) {
    selectIndex.value = null
  } else {
    selectIndex.value = result.value.audios.length + result.value.lists.length > 0 ? 0 : null
  }
})

onBeforeUpdate(() => {
  searchResultAudiosRefs.value = []
  searchResultListsRefs.value = []
})

onKeyDown('Escape', () => {
  show.value = false
})

onKeyDown('Enter', e => {
  if (!(e.target as Element).matches('.search-input')) {
    show.value = true
  }
})
</script>
