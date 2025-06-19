import type { Task, FilterType } from '@/types';

// Типы мутаций для модуля задач
export enum TasksMutations {
  SET_TASKS = 'SET_TASKS',
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  SET_FILTER = 'SET_FILTER',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
}

// Типы действий для модуля задач
export enum TasksActions {
  FETCH_TASKS = 'FETCH_TASKS',
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  TOGGLE_TASK = 'TOGGLE_TASK',
  SET_FILTER = 'SET_FILTER',
}

// Типы геттеров для модуля задач
export enum TasksGetters {
  FILTERED_TASKS = 'FILTERED_TASKS',
  TASKS_COUNT = 'TASKS_COUNT',
  ACTIVE_TASKS_COUNT = 'ACTIVE_TASKS_COUNT',
  COMPLETED_TASKS_COUNT = 'COMPLETED_TASKS_COUNT',
}

// Интерфейсы для payload мутаций
export interface SetTasksPayload {
  tasks: Task[];
}

export interface AddTaskPayload {
  task: Task;
}

export interface UpdateTaskPayload {
  task: Task;
}

export interface DeleteTaskPayload {
  id: number;
}

export interface SetFilterPayload {
  filter: FilterType;
}

export interface SetLoadingPayload {
  loading: boolean;
}

export interface SetErrorPayload {
  error: string | null;
}