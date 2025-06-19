/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vuex' {
  import { Store } from 'vuex'
  export { Store } from 'vuex'
  export function useStore<S = any>(key?: string): Store<S>
  export * from 'vuex'
}
