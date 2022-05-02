/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

interface ImportMetaEnv {
  readonly VITE_AUDIO_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*/audioDB.yml' {
  const audioDB: {
    audios: import('./src/logic/useAudioDB').Audio[]
    lists: import('./src/logic/useAudioDB').RawList[]
  }
  export default audioDB
}
