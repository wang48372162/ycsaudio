import { shallowMount } from '@vue/test-utils'
import Player from '@/components/Player.vue'

describe('Player', () => {
  it('play music', () => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementationOnce(() => Promise.resolve())

    const wrapper = shallowMount(Player, {
      propsData: {
        id: 1,
        src: 'https://example.com/01.mp3',
        title: 'Audio 01',
      },
      global: {
        stubs: [
          'PlayerControls',
          'PlayerTime',
          'PlayerVolume',
          'PlayerProgressBar',
        ],
      },
    })
    expect(wrapper.vm.audioRef).toBeTruthy()
    expect(wrapper.vm.audioRef.src).toBe('https://example.com/01.mp3')
    expect(wrapper.vm.error).toBe(false)
    expect(wrapper.emitted('error')).toBeFalsy()
  })
})
