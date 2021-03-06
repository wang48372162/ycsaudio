import { createLocalVue, shallowMount } from '@vue/test-utils'
import fs from 'fs'
import { resolve } from 'path'
import nock from 'nock'
import VueRouter from 'vue-router'
import Player from '@/components/Player/Player'

const localVue = createLocalVue()
localVue.use(VueRouter)

const music = fs.readFileSync(resolve(__dirname, '../../../mocks/music.mp3'))

describe('Player', () => {
  it('play music', () => {
    nock('https://example.com')
      .get('/01')
      .reply(200, music)

    const wrapper = shallowMount(Player, {
      localVue,
      propsData: {
        id: 1,
        src: 'https://example.com/01',
        title: 'Audio 01'
      }
    })
    expect(wrapper.vm.audio).toBeTruthy()
    expect(wrapper.vm.audio.src).toBe('https://example.com/01')
    expect(wrapper.vm.error).toBe(false)
    expect(wrapper.emitted('error')).toBeFalsy()
  })
})
