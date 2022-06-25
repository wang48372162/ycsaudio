import { shallowMount } from '@vue/test-utils'
import PlayerControls from '@/components/PlayerControls.vue'
import { Repeat } from '@/state'

describe('PlayerControls', () => {
  beforeAll(() => {
    vi.mock('vue-router', () => ({
      onBeforeRouteUpdate: vi.fn(),
    }))
  })

  it('emitted on-play', () => {
    const wrapper = shallowMount(PlayerControls, {
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })
    wrapper.find('[data-test=button-play]').trigger('click')
    expect(wrapper.emitted('play')).toBeTruthy()
  })

  it('emitted on-stop', () => {
    const wrapper = shallowMount(PlayerControls, {
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })
    wrapper.find('[data-test=button-stop]').trigger('click')
    expect(wrapper.emitted('stop')).toBeTruthy()
  })

  it('click repeat', async () => {
    const wrapper = shallowMount(PlayerControls, {
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })

    expect(wrapper.vm.repeatStatus).toBe(Repeat.None)

    await wrapper.find('[data-test=button-repeat]').trigger('click')
    await wrapper.find('[data-test=button-repeat]').trigger('click')

    expect(wrapper.emitted('updateRepeat')![0]).toEqual([Repeat.Single])
    expect(wrapper.emitted('updateRepeat')![1]).toEqual([Repeat.None])
  })

  it('click repeat and has listId', async () => {
    const wrapper = shallowMount(PlayerControls, {
      propsData: {
        listId: 'song',
      },
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })

    expect(wrapper.vm.repeatStatus).toBe(Repeat.None)

    await wrapper.find('[data-test=button-repeat]').trigger('click')
    await wrapper.find('[data-test=button-repeat]').trigger('click')
    await wrapper.find('[data-test=button-repeat]').trigger('click')

    expect(wrapper.emitted('updateRepeat')![0]).toEqual([Repeat.All])
    expect(wrapper.emitted('updateRepeat')![1]).toEqual([Repeat.Single])
    expect(wrapper.emitted('updateRepeat')![2]).toEqual([Repeat.None])
  })

  it('init get repeatStatus is Repeat.All and listId not found', () => {
    const wrapper = shallowMount(PlayerControls, {
      propsData: {
        repeatStatus: Repeat.All,
      },
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })

    expect(wrapper.emitted('updateRepeat')![0]).toEqual([Repeat.Single])
  })

  it('should see prev button and next button', () => {
    const wrapper = shallowMount(PlayerControls, {
      stubs: ['router-link'],
      propsData: {
        listId: 'song',
        prevId: 1,
        nextId: 3,
      },
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })

    const btnPrev = wrapper.find('[data-test=button-prev]')
    const btnNext = wrapper.find('[data-test=button-next]')

    expect(btnPrev.exists()).toBe(true)
    expect(btnNext.exists()).toBe(true)
    expect(btnPrev.element.getAttribute('disabled')).toBe('false')
    expect(btnNext.element.getAttribute('disabled')).toBe('false')
  })

  it('should see disabled prev button and next button', () => {
    const wrapper = shallowMount(PlayerControls, {
      propsData: {
        listId: 'song',
      },
      global: {
        directives: {
          tippy: vi.fn(),
        },
      },
    })

    const btnPrev = wrapper.find('[data-test=button-prev]')
    const btnNext = wrapper.find('[data-test=button-next]')

    expect(btnPrev.exists()).toBe(true)
    expect(btnNext.exists()).toBe(true)
    expect(btnPrev.element.getAttribute('disabled')).toBe('true')
    expect(btnNext.element.getAttribute('disabled')).toBe('true')
  })
})
