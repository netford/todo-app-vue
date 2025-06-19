import { Store } from 'vuex'
import { RootState } from '@/types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

// Модуль расширения для типизации useStore
declare module 'vuex' {
  export { Store } from 'vuex'
  export function useStore<S = any>(key?: string): Store<S>
}