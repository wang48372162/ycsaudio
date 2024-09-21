import { shallowMount } from '@vue/test-utils'
import PlayerVolume from '@/components/PlayerVolume.vue'

describe('PlayerVolume', () => {
  it('emitted on-muted', () => {
    const wrapper = shallowMount(PlayerVolume, {
      propsData: {
        muted: false,
      },
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })
    wrapper.find('[data-test=volume-muted]').trigger('click')
    expect(wrapper.emitted('muted')![0]).toEqual([true])
  })
})
