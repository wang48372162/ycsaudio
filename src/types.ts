import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Audio {
  id: number
  url: string
  title: string
}

export interface RawList {
  id: string
  name: string
  audios: string | number[]
}

export interface List extends RawList {
  audios: number[]
}
