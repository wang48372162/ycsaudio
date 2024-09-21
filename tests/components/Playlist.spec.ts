import { config, shallowMount } from '@vue/test-utils'
import { mockAudioDB } from '../mockAudioDB'
import Playlist from '@/components/Playlist.vue'

describe('Playlist', () => {
  beforeAll(() => {
    config.global.renderStubDefaultSlot = true
    mockAudioDB()
  })

  afterAll(() => {
    config.global.renderStubDefaultSlot = false
  })

  it('mounted playlist', () => {
    vi.mock('vue-router', () => ({
      useRoute: vi.fn().mockImplementationOnce(() => ({
        params: {
          audio: '1',
        },
      })),
    }))

    const wrapper = shallowMount(Playlist, {
      propsData: {
        id: 'song',
        title: '歌曲',
        audios: [1, 2, 3],
      },
      global: {
        stubs: ['RouterLink'],
      },
    })

    expect(wrapper.find('[data-test=list-title]').text()).toBe('歌曲')
    expect(wrapper.vm.audioList).toEqual([
      {
        id: 1,
        title: 'Audio 01',
        url: 'https://example.com/01.mp3',
      },
      {
        id: 2,
        title: 'Audio 02',
        url: 'https://example.com/02.mp3',
      },
      {
        id: 3,
        title: 'Audio 03',
        url: 'https://example.com/03.mp3',
      },
    ])
  })
})
