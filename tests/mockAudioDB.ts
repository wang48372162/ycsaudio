import { vi } from 'vitest'
import audioDB from './mocks/audioDB.yml'

export function mockAudioDB() {
  vi.mock('@/../data/audioDB.yml', () => ({ default: audioDB }))
}
