import type { Module } from 'vuex';
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
  },

  [TasksMutations.ADD_TASK](state: TasksState, payload: AddTaskPayload) {
    state.tasks.push(payload.task);
  },

  [TasksMutations.UPDATE_TASK](state: TasksState, payload: UpdateTaskPayload) {
    const index = state.tasks.findIndex(task => task.id === payload.task.id);
    if (index !== -1) {
      state.tasks.splice(index, 1, payload.task);
    }
  },

  [TasksMutations.DELETE_TASK](state: TasksState, payload: DeleteTaskPayload) {
    const index = state.tasks.findIndex(task => task.id === payload.id);
    if (index !== -1) {
      state.tasks.splice(index, 1);
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
  // Загрузка задач
  async [TasksActions.FETCH_TASKS]({ commit }: any) {
    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      const tasks = await tasksAPI.getTasks();
      commit(TasksMutations.SET_TASKS, { tasks });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Создание задачи
  async [TasksActions.CREATE_TASK]({ commit }: any, taskData: CreateTaskDto) {
    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      const task = await tasksAPI.createTask(taskData);
      commit(TasksMutations.ADD_TASK, { task });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания задачи';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
      throw error; // Пробрасываем ошибку для UI
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Обновление задачи
  async [TasksActions.UPDATE_TASK]({ commit }: any, updateData: { id: number; title?: string; completed?: boolean }) {
    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      const task = await tasksAPI.updateTask(updateData);
      commit(TasksMutations.UPDATE_TASK, { task });
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
      
      await tasksAPI.deleteTask(id);
      commit(TasksMutations.DELETE_TASK, { id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления задачи';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
      throw error;
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Переключение статуса задачи
  async [TasksActions.TOGGLE_TASK]({ commit, state }: any, id: number) {
    const task = state.tasks.find((t: Task) => t.id === id);
    if (!task) return;

    try {
      commit(TasksMutations.SET_LOADING, { loading: true });
      commit(TasksMutations.CLEAR_ERROR);
      
      const updatedTask = await tasksAPI.updateTask({
        id,
        completed: !task.completed,
      });
      commit(TasksMutations.UPDATE_TASK, { task: updatedTask });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка изменения статуса';
      commit(TasksMutations.SET_ERROR, { error: errorMessage });
      throw error;
    } finally {
      commit(TasksMutations.SET_LOADING, { loading: false });
    }
  },

  // Установка фильтра
  [TasksActions.SET_FILTER]({ commit }: any, filter: FilterType) {
    commit(TasksMutations.SET_FILTER, { filter });
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