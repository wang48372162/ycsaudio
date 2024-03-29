import audioDB from '@/../data/audioDB.yml'
import type { Audio, List } from '@/types'

function formatAudio(audio: Audio) {
  if (!/^https?:\/\//.test(audio.url)) {
    audio.url = [
      import.meta.env.VITE_AUDIO_BASE_URL.replace(/\/+$/, ''),
      audio.url.replace(/^\/+/, ''),
    ].join('/')
  }
  return audio
}

export function getAudio(id: number | string) {
  const audio = audioDB.audios.find(v => v.id === Number(id))
  return audio ? formatAudio(audio) : null
}

export function getAudios() {
  return audioDB.audios.map(formatAudio)
}

export function getList(id: string | null) {
  const list = audioDB.lists.find(v => v.id === id)
  if (!list) return

  if (typeof list.audios === 'string') {
    list.audios = list.audios.split(',').map(id => Number(id))
  } else {
    list.audios = list.audios.map(id => Number(id))
  }
  return list as List
}

export function getLists() {
  return audioDB.lists.map(list => getList(list.id)!)
}

export function listContainAudio(
  listId: string | null,
  audioId: number
) {
  const list = getList(listId)
  if (!list) return false

  return list.audios.includes(Number(audioId))
}

export function getAudioIndexFromList(
  listId: string | null,
  audioId: number
) {
  const list = getList(listId)
  if (!list) return

  return list.audios.findIndex(id => id === Number(audioId))
}
