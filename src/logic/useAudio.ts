import { reactive } from 'vue'
import { getAudio } from './useAudioDB'

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
