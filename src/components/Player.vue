<template>
  <div class="card">
    <div class="p-5">
      <audio ref="audioRef">HTML5 Audio not supported</audio>

      <h1 class="truncate text-2xl font-semibold">{{ title }}</h1>

      <PlayerControls
        class="my-8"
        :played="played"
        :repeat-status="repeat.status"
        :list-id="listId"
        :prev-id="prevId"
        :next-id="nextId"
        :error="error"
        @play="clickPlay"
        @stop="clickStop"
        @update-repeat="clickRepeat"
      />

      <div class="flex justify-between">
        <PlayerTime :duration="duration" :current-time="currentTime" />

        <PlayerVolume :volume="volume" :muted="muted" @change="changeVolume" @muted="changeMuted" />
      </div>

      <PlayerProgressBar
        class="mt-2"
        :current-time="currentTime"
        :duration="duration"
        :error="error"
        @change="changeProgress"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import { getList, getAudioIndexFromList } from '@/logic/useAudioDB'
import { Repeat } from '@/state'

const emit = defineEmits(['before-load', 'loaded-dom', 'loaded', 'error'])

const props = withDefaults(
  defineProps<{
    id: number
    src: string
    title: string
    autoplay?: boolean
    listId?: string
  }>(),
  {
    autoplay: true,
    listId: '',
  }
)

const router = useRouter()

const audioRef = ref<HTMLMediaElement>(null!)

const played = ref(false)
const error = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const volume = useLocalStorage('ycsaudio-volume', 100)
const muted = useLocalStorage('ycsaudio-muted', false)

const audioIndex = computed(() => (props.id ? getAudioIndexFromList(props.listId, props.id) : null))

const listAudios = computed(() => getList(props.listId)?.audios)

const repeat = reactive({
  status: useLocalStorage('ycsaudio-repeat-status', Repeat.None),
  isAll: computed(() => repeat.status === Repeat.All),
  isSingle: computed(() => repeat.status === Repeat.Single),
}) as {
  status: Repeat
  isAll: boolean
  isSingle: boolean
}

const prevId = computed(() => {
  if (typeof audioIndex.value !== 'number' || !listAudios.value) return

  const index = audioIndex.value - 1
  if (index < -1) return

  // If repeat mode is all, and prev audio is last audio.
  if (repeat.isAll && index === -1) {
    return listAudios.value[listAudios.value.length - 1]
  }
  return listAudios.value[index]
})

const nextId = computed(() => {
  if (typeof audioIndex.value !== 'number' || !listAudios.value) return

  const index = audioIndex.value + 1
  if (index > listAudios.value.length) return

  // If repeat mode is all, and next audio is last audio.
  if (repeat.isAll && index === listAudios.value.length) {
    return listAudios.value[0]
  }
  return listAudios.value[index]
})

function loadAudio() {
  emit('before-load')

  // Audio src
  audioRef.value.src = props.src
  error.value = false

  emit('loaded-dom', audioRef.value)
}

function clickPlay() {
  if (error.value) return null

  if (audioRef.value) {
    if (audioRef.value.paused) {
      audioRef.value.play()
    } else {
      audioRef.value.pause()
    }

    played.value = Boolean(audioRef.value.paused)
  }
}

function clickStop() {
  if (error.value) return null

  audioRef.value.currentTime = 0
  audioRef.value.pause()
  played.value = false
}

function clickRepeat(status: Repeat) {
  if (error.value) return null

  repeat.status = status
}

async function repeatAudio() {
  if (props.listId && nextId.value && !repeat.isSingle) {
    if (error.value) {
      await promiseTimeout(3e3)
    }

    router.push({
      name: 'audio-audio',
      params: { audio: nextId.value },
      query: props.listId ? { list: props.listId } : {},
    })
  }

  if (repeat.isSingle && !error.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play()
  }
}

function changeProgress(newCurrentTime: number) {
  currentTime.value = newCurrentTime
  if (audioRef.value) {
    audioRef.value.currentTime = newCurrentTime
  }
}

function changeVolume(newVolume: number) {
  volume.value = newVolume
  if (audioRef.value) {
    audioRef.value.volume = newVolume / 100
  }
}

function changeMuted(newMuted: boolean) {
  muted.value = newMuted
  if (audioRef.value) {
    audioRef.value.muted = newMuted
  }
}

onMounted(() => {
  // Audio init
  audioRef.value.preload = 'auto'

  // Set autoplay
  audioRef.value.autoplay = props.autoplay
  played.value = props.autoplay

  // Load sudio
  loadAudio()

  // Audio events
  audioRef.value.addEventListener('loadedmetadata', function () {
    duration.value = this.duration
  })
  audioRef.value.addEventListener('canplay', function () {
    emit('loaded')
  })
  audioRef.value.addEventListener('play', function () {
    played.value = true
  })
  audioRef.value.addEventListener('pause', function () {
    played.value = false
  })
  audioRef.value.addEventListener('ended', function () {
    repeatAudio()
  })
  audioRef.value.addEventListener('error', function () {
    error.value = true
    emit('error')
    emit('loaded')
    repeatAudio()
  })
  audioRef.value.addEventListener('timeupdate', function () {
    duration.value = this.duration
    currentTime.value = this.currentTime
  })
  audioRef.value.addEventListener('volumechange', function () {
    volume.value = Math.floor(this.volume * 100)
  })

  // Play audio
  if (props.autoplay) {
    audioRef.value
      .play()
      .then(() => {})
      .catch(e => {
        if (import.meta.env.DEV) console.error(e)
        played.value = false
      })
  }
})

watch(() => props.src, loadAudio)
</script>
