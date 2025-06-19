// Основной интерфейс задачи (по требованию задания)
export interface Task {
    id: number;
    title: string;
    completed: boolean;
  }
  
  // Тип для фильтрации задач
  export type FilterType = 'all' | 'active' | 'completed';
  
  // Интерфейс состояния задач в store
  export interface TasksState {
    tasks: Task[];
    filter: FilterType;
    loading: boolean;
    error: string | null;
  }
  
  // Интерфейс корневого состояния приложения
  export interface RootState {
    tasks: TasksState;
  }
  
  // Тип для создания новой задачи (без id)
  export interface CreateTaskDto {
    title: string;
  }
  
  // Тип для обновления задачи
  export interface UpdateTaskDto {
    id: number;
    title?: string;
    completed?: boolean;
  }