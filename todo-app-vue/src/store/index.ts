// @ts-ignore
import { createStore } from 'vuex'
import tasks from './modules/tasks'
import type { RootState } from '@/types'

// Создание и настройка Vuex store
export const store = createStore<RootState>({
  modules: {
    tasks
  },
  
  // Строгий режим - предупреждает об изменении состояния вне мутаций
  strict: import.meta.env.DEV,
});

// Экспорт типа store для TypeScript
export type Store = typeof store;