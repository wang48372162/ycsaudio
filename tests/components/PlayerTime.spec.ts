import { shallowMount } from '@vue/test-utils'
import PlayerTime from '@/components/PlayerTime.vue'

describe('PlayerTime', () => {
  it('should be to see the time text', () => {
    const wrapper = shallowMount(PlayerTime, {
      propsData: {
        duration: 123,
        currentTime: 77,
      },
    })
    expect(wrapper.html()).toBe('<div class="select-none">01:17 / 02:03</div>')
  })

  it('set NaN duration', () => {
    const wrapper = shallowMount(PlayerTime, {
      propsData: {
        duration: Number.NaN,
        currentTime: Number.NaN,
      },
    })
    expect(wrapper.html()).toBe('<div class="select-none">00:00 / 00:00</div>')
  })
})
