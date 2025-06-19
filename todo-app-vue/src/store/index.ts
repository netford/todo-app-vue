import { createStore } from 'vuex';
import type { RootState } from '@/types';
import tasksModule from './modules/tasks';

// Создание и настройка Vuex store
export const store = createStore<RootState>({
  modules: {
    tasks: tasksModule,
  },
  
  // Строгий режим - предупреждает об изменении состояния вне мутаций
  strict: import.meta.env.DEV,
});

// Экспорт типа store для TypeScript
export type Store = typeof store;