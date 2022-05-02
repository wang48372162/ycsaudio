import { reactive } from 'vue'
import { getList } from './useAudioDB'

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
