import { Store } from 'vuex'
import { RootState } from '@/types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

// Типизация для useStore() в Composition API
declare module 'vuex' {
  export * from 'vuex/types/index.d.ts'
  export { Store, useStore } from 'vuex/types/index.d.ts'
}