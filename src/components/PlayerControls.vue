<template>
  <div class="flex items-center justify-center">
    <PlayerControlButton
      v-if="listId"
      type="link"
      :to="audioTo(prevId)"
      :title="title.btnPrev"
      :svg-path="path.prevBtn"
      :disabled="error || !prevId"
    />

    <PlayerControlButton
      type="button"
      :title="btnText[path.playMode]"
      :svg-path="path.playBtn"
      :disabled="error"
      @click="play"
    />

    <PlayerControlButton
      type="button"
      :title="btnText.stop"
      :svg-path="path.stopBtn"
      :disabled="error"
      @click="stop"
    />

    <PlayerControlButton
      type="button"
      :title="btnText.repeatMode[repeatStatus]"
      :svg-path="path.repeatBtn"
      :lighten="repeatStatus !== Repeat.All && repeatStatus !== Repeat.Single"
      :disabled="error"
      @click="repeat"
    />

    <PlayerControlButton
      v-if="listId"
      type="link"
      :to="audioTo(nextId)"
      :title="title.btnNext"
      :svg-path="path.nextBtn"
      :disabled="error || !nextId"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router'
import { getAudio } from '@/logic/useAudioDB'
import { Repeat } from '@/state'

const props = withDefaults(
  defineProps<{
    played: boolean
    repeatStatus: Repeat
    listId: string
    prevId?: number
    nextId?: number
    error: boolean
  }>(),
  {
    played: false,
    repeatStatus: Repeat.None,
    listId: '',
    error: false,
  }
)

const emit = defineEmits(['play', 'stop', 'updateRepeat'])

function useRepeat(initialValue = Repeat.None) {
  const repeatStatus = ref(initialValue)

  function repeat() {
    if (props.error) return

    if (repeatStatus.value === Repeat.None) {
      if (!props.listId) {
        repeatStatus.value = Repeat.Single
      } else {
        repeatStatus.value = Repeat.All
      }
    } else if (repeatStatus.value === Repeat.All) {
      repeatStatus.value = Repeat.Single
    } else if (repeatStatus.value === Repeat.Single) {
      repeatStatus.value = Repeat.None
    }
  }

  function initialRepeatValue() {
    if (!props.listId && repeatStatus.value === Repeat.All) {
      repeatStatus.value = Repeat.Single
    }
  }

  watch(() => props.repeatStatus, status => {
    repeatStatus.value = status
  })

  watch(repeatStatus, status => {
    emit('updateRepeat', status)
  })

  initialRepeatValue()
  onBeforeRouteUpdate(initialRepeatValue)

  return { repeat, repeatStatus }
}

const { repeat, repeatStatus } = useRepeat(props.repeatStatus)

const btnText = {
  play: '播放 (Space)',
  pause: '暫停 (Space)',
  stop: '停止 (S)',
  repeat: '循環 (R)',
  repeatMode: ['無循環', '全部循環', '單曲循環'],
  prev: '上一首',
  next: '下一首',
}

const path = reactive({
  playMode: computed(() => {
    return !props.played ? 'play' : 'pause'
  }),

  playBtn: computed(() => {
    return !props.played
      ? 'M 10,8 26,17 26,33 10,41 z M 26,17 41,25 41,25 26,33 z'
      : 'M 10,8 20,8 20,41 10,41 z M 31,8 41,8 41,41 31,41 z'
  }),

  stopBtn: 'M 10,8 41,8 41,41 10,41 z',

  repeatBtn: computed(() => {
    const repeatStatusPath = 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 25,25 25,25 25,25 25,25 25,25 z'

    const repeatStatusOnePath = 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 27,16 19,24 23,24 23,33 27,33 z'

    if (repeatStatus.value === Repeat.None || repeatStatus.value === Repeat.All) {
      return repeatStatusPath
    } else if (repeatStatus.value === Repeat.Single) {
      return repeatStatusOnePath
    }
    return repeatStatusPath
  }),

  prevBtn: 'M 10,8 17,8 17,41 10,41 z M 17,25 41,8 41,41 z',
  nextBtn: 'M 10,8 34,25 10,41 z M 34,8 41,8 41,41 34,41 z',
})

const title = reactive({
  btnPrev: computed(() => {
    return props.prevId ? getAudio(props.prevId)?.title : ''
  }),
  btnNext: computed(() => {
    return props.nextId ? getAudio(props.nextId)?.title : ''
  }),
})

function play() {
  emit('play')
}

function stop() {
  emit('stop')
}

function audioTo(id: number | undefined) {
  if (!id) return
  return {
    name: 'audio-audio',
    params: { audio: id },
    query: props.listId ? { list: props.listId } : {},
  }
}

const { Space, S, R } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === ' ') {
      e.preventDefault()
    }
  },
})

whenever(Space, play)
whenever(S, stop)
whenever(R, repeat)
</script>