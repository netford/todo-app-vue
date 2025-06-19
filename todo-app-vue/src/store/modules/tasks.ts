// @ts-ignore
import type { Module } from 'vuex'
import type { TasksState, RootState, Task, FilterType, CreateTaskDto } from '@/types';
import { tasksAPI } from '@/api/tasks';
import {
  TasksMutations,
  TasksActions,
  TasksGetters,
  type SetTasksPayload,
  type AddTaskPayload,
  type UpdateTaskPayload,
  type DeleteTaskPayload,
  type SetFilterPayload,
  type SetLoadingPayload,
  type SetErrorPayload,
} from '../types';

// Константы для localStorage
const STORAGE_KEY = 'vue-todo-tasks';

// Утилиты для работы с localStorage
const storageUtils = {
  // Сохранение задач в localStorage
  saveToStorage(tasks: Task[]): void {
    try {
      const serializedTasks = JSON.stringify(tasks);
      localStorage.setItem(STORAGE_KEY, serializedTasks);
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  },

  // Загрузка задач из localStorage
  loadFromStorage(): Task[] | null {
    try {
      const serializedTasks = localStorage.getItem(STORAGE_KEY);
      if (serializedTasks === null) {
        return null;
      }
      const tasks = JSON.parse(serializedTasks);
      
      // Валидация данных
      if (!Array.isArray(tasks)) {
        console.warn('Некорректные данные в localStorage');
        return null;
      }
      
      // Проверка структуры каждой задачи
      const validTasks = tasks.filter(task => 
        typeof task === 'object' &&
        task !== null &&
        typeof task.id === 'number' &&
        typeof task.title === 'string' &&
        typeof task.completed === 'boolean'
      );
      
      return validTasks;
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
      return null;
    }
  },

  // Очистка localStorage
  clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Ошибка очистки localStorage:', error);
    }
  }
};

// Начальное состояние модуля
const state: TasksState = {
  tasks: [],
  filter: 'all',
  loading: false,
  error: null,
};

// Мутации - синхронные изменения состояния
const mutations = {
  [TasksMutations.SET_TASKS](state: TasksState, payload: SetTasksPayload) {
    state.tasks = payload.tasks;
    // Автосохранение в localStorage
    storageUtils.saveToStorage(state.tasks);
  },

  [TasksMutations.ADD_TASK](state: TasksState, payload: AddTaskPayload) {
    state.tasks.push(payload.task);
    // Автосохранение в localStorage
    storageUtils.saveToStorage(state.tasks);
  },

  [TasksMutations.UPDATE_TASK](state: TasksState, payload: UpdateTaskPayload) {
    const index = state.tasks.findIndex(task => task.id === payload.task.id);
    if (index !== -1) {
      state.tasks.splice(index, 1, payload.task);
      // Автосохранение в localStorage
      storageUtils.saveToStorage(state.tasks);
    }
  },

  [TasksMutations.DELETE_TASK](state: TasksState, payload: DeleteTaskPayload) {
    const index = state.tasks.findIndex(task => task.id === payload.id);
    if (index !== -1) {
      state.tasks.splice(index, 1);
      // Автосохранение в localStorage
      storageUtils.saveToStorage(state.tasks);
    }
  },

  [TasksMutations.SET_FILTER](state: TasksState, payload: SetFilterPayload) {
    state.filter = payload.filter;
  },

  [TasksMutations.SET_LOADING](state: TasksState, payload: SetLoadingPayload) {
    state.loading = payload.loading;
  },

  [TasksMutations.SET_ERROR](state: TasksState, payload: SetErrorPayload) {
    state.error = payload.error;
  },

  [TasksMutations.CLEAR_ERROR](state: TasksState) {
    state.error = null;
  },
};

// Действия - асинхронные операции
const actions = {
  // Загрузка задач (сначала localStorage, потом API)
  async [TasksActions.FETCH_TASKS]({ commit }: any) {
    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      // Сначала пытаемся загрузить из localStorage
      const cachedTasks = storageUtils.loadFromStorage();
      
      if (cachedTasks && cachedTasks.length > 0) {
        // Если есть кэшированные данные, используем их
        commit(TasksMutations.SET_TASKS, { tasks: cachedTasks });
        console.log('Задачи загружены из localStorage:', cachedTasks.length);
      } else {
        // Если localStorage пустой, загружаем mock данные из API
        try {
          const tasks = await tasksAPI.getTasks();
          commit(TasksMutations.SET_TASKS, { tasks });
          console.log('Задачи загружены из API:', tasks.length);
        } catch (apiError) {
          // Если API недоступен, создаем демо-данные
          const demoTasks: Task[] = [
            {
              id: 1,
              title: 'Изучить Vue 3 Composition API',
              completed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 2,
              title: 'Настроить Vuex store',
              completed: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 3,
              title: 'Добавить поддержку localStorage',
              completed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          commit(TasksMutations.SET_TASKS, { tasks: demoTasks });
          console.log('Загружены демо-данные');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Создание задачи
  async [TasksActions.CREATE_TASK]({ commit, state }: any, taskData: CreateTaskDto) {
    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      // Создаем задачу локально (для демонстрации)
      const newTask: Task = {
        id: Date.now(), // Простая генерация ID
        title: taskData.title,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        // Пытаемся создать через API
        const task = await tasksAPI.createTask(taskData);
        commit(TasksMutations.ADD_TASK, { task });
      } catch (apiError) {
        // Если API недоступен, используем локальную задачу
        commit(TasksMutations.ADD_TASK, { task: newTask });
        console.log('Задача создана локально (API недоступен)');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания задачи';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
      throw error;
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Обновление задачи
  async [TasksActions.UPDATE_TASK]({ commit, state }: any, updateData: { id: number; title?: string; completed?: boolean }) {
    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      // Находим задачу в локальном состоянии
      const existingTask = state.tasks.find((t: Task) => t.id === updateData.id);
      if (!existingTask) {
        throw new Error('Задача не найдена');
      }
      
      // Создаем обновленную задачу
      const updatedTask: Task = {
        ...existingTask,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      try {
        // Пытаемся обновить через API
        const task = await tasksAPI.updateTask(updateData);
        commit(TasksMutations.UPDATE_TASK, { task });
      } catch (apiError) {
        // Если API недоступен, используем локальное обновление
        commit(TasksMutations.UPDATE_TASK, { task: updatedTask });
        console.log('Задача обновлена локально (API недоступен)');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления задачи';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
      throw error;
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Удаление задачи
  async [TasksActions.DELETE_TASK]({ commit }: any, id: number) {
    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      try {
        // Пытаемся удалить через API
        await tasksAPI.deleteTask(id);
        commit(TasksMutations.DELETE_TASK, { id });
      } catch (apiError) {
        // Если API недоступен, удаляем локально
        commit(TasksMutations.DELETE_TASK, { id });
        console.log('Задача удалена локально (API недоступен)');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления задачи';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
      throw error;
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Переключение статуса задачи
  async [TasksActions.TOGGLE_TASK]({ commit, state, dispatch }: any, id: number) {
    const task = state.tasks.find((t: Task) => t.id === id);
    if (!task) return;

    try {
      await dispatch(TasksActions.UPDATE_TASK, {
        id,
        completed: !task.completed,
      });
    } catch (error) {
      // Ошибка уже обработана в UPDATE_TASK
      throw error;
    }
  },

  // Установка фильтра
  [TasksActions.SET_FILTER]({ commit }: any, filter: FilterType) {
    commit(TasksMutations.SET_FILTER, { filter });
  },

  // Очистка всех задач
  [TasksActions.CLEAR_ALL_TASKS]({ commit }: any) {
    commit(TasksMutations.SET_TASKS, { tasks: [] });
    storageUtils.clearStorage();
  },
};

// Геттеры - вычисляемые свойства
const getters = {
  // Отфильтрованные задачи
  [TasksGetters.FILTERED_TASKS]: (state: TasksState): Task[] => {
    switch (state.filter) {
      case 'active':
        return state.tasks.filter(task => !task.completed);
      case 'completed':
        return state.tasks.filter(task => task.completed);
      default:
        return state.tasks;
    }
  },

  // Общее количество задач
  [TasksGetters.TASKS_COUNT]: (state: TasksState): number => {
    return state.tasks.length;
  },

  // Количество активных задач
  [TasksGetters.ACTIVE_TASKS_COUNT]: (state: TasksState): number => {
    return state.tasks.filter(task => !task.completed).length;
  },

  // Количество выполненных задач
  [TasksGetters.COMPLETED_TASKS_COUNT]: (state: TasksState): number => {
    return state.tasks.filter(task => task.completed).length;
  },
};

// Экспорт модуля
const tasksModule: Module<TasksState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default tasksModule;