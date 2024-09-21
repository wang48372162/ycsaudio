<template>
  <div class="relative ml-3 inline-block">
    <button
      type="button"
      class="p-1"
      title="搜尋 (/)"
      @click="showSearchBox = true"
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

    <ClientOnly>
      <div
        v-if="showSearchBox"
        ref="searchBoxRef"
        class="fixed inset-0 z-10 flex flex-col bg-white p-4 sm:absolute sm:inset-auto sm:right-0 sm:w-[288px] sm:mt-2 sm:shadow"
      >
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
          @click="showSearchBox = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>

        <div
          v-if="result && search"
          class="-mx-4 mt-4 -mb-4 flex-1 grow overflow-y-auto sm:max-h-[400px] sm:grow-0"
        >
          <template v-if="result.audios.length">
            <h3 class="px-4 pb-2 text-xl font-bold">
              歌曲：
            </h3>
            <ul class="mb-2">
              <li
                v-for="(audio, i) in result.audios"
                :key="audio.id"
                :ref="el => searchResultAudiosRefs[i] = (el as HTMLElement)"
              >
                <RouterLink
                  :to="audioTo(audio.id)"
                  class="block px-4 py-2"
                  :class="i === selectedAudioIndex ? 'bg-black text-white' : 'hover:bg-gray-100'"
                  @click="onClickLink"
                >
                  {{ audio.title }}
                  <RouterLink
                    v-if="currentList && audioListTo(audio.id)"
                    :to="audioTo(audio.id, true)"
                    class="whitespace-nowrap rounded px-1 text-sm"
                    :class="i === selectedAudioIndex ? 'bg-white text-black' : 'bg-black text-white'"
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
                :ref="el => searchResultListsRefs[i] = (el as HTMLElement)"
              >
                <RouterLink
                  :to="listTo(list.id)"
                  class="block px-4 py-2"
                  :class="i === selectedListIndex ? 'bg-black text-white' : 'hover:bg-gray-100'"
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
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { onKeyDown } from '@vueuse/core'
import { showSearchBox } from '@/state'

const route = useRoute()
const router = useRouter()

const search = ref('')
const selectIndex = ref<number | null>(null)

const searchRef = ref(null!) as Ref<HTMLElement>
const searchBoxRef = ref(null!) as Ref<HTMLElement>
const searchResultAudiosRefs = ref([]) as Ref<HTMLElement[]>
const searchResultListsRefs = ref([]) as Ref<HTMLElement[]>

const result = computed(() => ({
  audios: search.value
    ? getAudios().filter(audio => searchText(search.value, audio.title))
    : [],
  lists: search.value
    ? getLists().filter(list => searchText(search.value, list.name))
    : [],
}))

const resultEmpty = computed(() => {
  return !result.value.audios.length && !result.value.lists.length
})

const selectedAudioIndex = computed(() => {
  if (selectIndex.value === null) return null
  if (selectIndex.value >= result.value.audios.length) return null
  return selectIndex.value
})

const selectedAudio = computed(() => {
  if (selectedAudioIndex.value === null) return null
  return result.value.audios[selectedAudioIndex.value]
})

const selectedAudioEl = computed(() => {
  if (selectedAudioIndex.value === null) return null
  return searchResultAudiosRefs.value[selectedAudioIndex.value]
})

const selectedListIndex = computed(() => {
  if (selectIndex.value === null) return null
  if (selectIndex.value < result.value.audios.length) return null
  return selectIndex.value - result.value.audios.length
})

const selectedList = computed(() => {
  if (selectedListIndex.value === null) return null
  return result.value.lists[selectedListIndex.value]
})

const selectedListEl = computed(() => {
  if (selectedListIndex.value === null) return null
  return searchResultListsRefs.value[selectedListIndex.value]
})

const queryListId = computed(() =>
  route.name === 'playlist'
    ? (route.params.playlist as string | null)
    : (route.query?.list as string | null)
)

const currentList = computed(() =>
  queryListId.value
    ? getList(queryListId.value)
    : null
)

function searchText(key: string, text: string) {
  return text.toLowerCase().includes(key.toLowerCase())
}

function selectScrollIntoView() {
  if (selectedAudioEl.value) {
    selectedAudioEl.value.scrollIntoView({ block: 'nearest' })
  } else if (selectedListEl.value) {
    selectedListEl.value.scrollIntoView({ block: 'nearest' })
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
  showSearchBox.value = false
  search.value = ''
  selectIndex.value = null
}

function searchEnter() {
  let targetRoute = null
  if (selectedAudio.value) {
    targetRoute = audioTo(selectedAudio.value.id, true)
  } else if (selectedList.value) {
    targetRoute = listTo(selectedList.value.id)
  }
  if (selectIndex.value !== null && targetRoute) {
    onClickLink()
    router.push(targetRoute)
  }
}

function searchKeydown() {
  const resultsLength = result.value.audios.length + result.value.lists.length
  if (resultsLength === 0) return

  if (selectIndex.value === null) {
    selectIndex.value = 0
  } else if (selectIndex.value < resultsLength - 1) {
    selectIndex.value++
  }

  selectScrollIntoView()
}

function searchKeyup() {
  if (selectIndex.value === null) return

  if (selectIndex.value > 0) {
    selectIndex.value--
  }

  selectScrollIntoView()
}

onClickOutside(searchBoxRef, () => {
  showSearchBox.value = false
})

whenever(showSearchBox, async () => {
  await nextTick()
  searchRef.value?.focus()
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
  showSearchBox.value = false
})

onKeyDown('/', e => {
  if (!showSearchBox.value) {
    e.preventDefault()
    showSearchBox.value = true
  }
})
</script>
