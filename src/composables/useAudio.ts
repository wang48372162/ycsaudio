import { reactive } from 'vue'
import { getAudio, getList } from '@/logic/audio'

export function useAudio() {
  const audio = reactive({
    id: 0,
    src: '',
    title: '',
  })

  function fetchAudioData(id: number | string) {
    audio.id = 0
    audio.src = ''
    audio.title = ''

    const audioResult = getAudio(Number(id))
    if (audioResult) {
      audio.id = audioResult.id
      audio.src = audioResult.url
      audio.title = audioResult.title
    }
  }

  return { audio, fetchAudioData }
}

export function usePlaylist() {
  const list = reactive({
    id: '',
    title: '',
    audios: [] as number[],
  })

  function fetchListData(id: string) {
    list.id = ''
    list.title = ''
    list.audios = []

    const listResult = getList(id)
    if (listResult) {
      list.id = listResult.id
      list.title = listResult.name
      list.audios = listResult.audios
    }
  }

  return { list, fetchListData }
}
