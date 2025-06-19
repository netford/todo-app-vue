import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

// Симуляция задержки сети
const API_DELAY = 800;

// Мокированные данные для демонстрации
const mockTasks: Task[] = [
  { id: 1, title: 'Изучить Vue 3 Composition API', completed: false },
  { id: 2, title: 'Настроить Vuex store', completed: true },
  { id: 3, title: 'Создать компоненты для задач', completed: false },
];

// Хранилище в памяти (имитация базы данных)
let tasksStorage: Task[] = [...mockTasks];
let nextId = Math.max(...mockTasks.map(t => t.id)) + 1;

// Утилита для имитации задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Имитация случайных ошибок (5% вероятность)
const shouldFail = () => Math.random() < 0.05;

export const tasksAPI = {
  // Получение всех задач
  async getTasks(): Promise<Task[]> {
    await delay(API_DELAY);
    
    if (shouldFail()) {
      throw new Error('Ошибка загрузки задач');
    }
    
    return [...tasksStorage];
  },

  // Создание новой задачи
  async createTask(taskData: CreateTaskDto): Promise<Task> {
    await delay(API_DELAY);
    
    if (shouldFail()) {
      throw new Error('Ошибка создания задачи');
    }

    if (!taskData.title.trim()) {
      throw new Error('Название задачи не может быть пустым');
    }

    const newTask: Task = {
      id: nextId++,
      title: taskData.title.trim(),
      completed: false,
    };

    tasksStorage.push(newTask);
    return newTask;
  },

  // Обновление задачи
  async updateTask(updateData: UpdateTaskDto): Promise<Task> {
    await delay(API_DELAY);
    
    if (shouldFail()) {
      throw new Error('Ошибка обновления задачи');
    }

    const taskIndex = tasksStorage.findIndex(task => task.id === updateData.id);
    
    if (taskIndex === -1) {
      throw new Error('Задача не найдена');
    }

    const updatedTask = {
      ...tasksStorage[taskIndex],
      ...updateData,
    };

    // Валидация названия при обновлении
    if (updatedTask.title && !updatedTask.title.trim()) {
      throw new Error('Название задачи не может быть пустым');
    }

    if (updatedTask.title) {
      updatedTask.title = updatedTask.title.trim();
    }

    tasksStorage[taskIndex] = updatedTask;
    return updatedTask;
  },

  // Удаление задачи
  async deleteTask(id: number): Promise<void> {
    await delay(API_DELAY);
    
    if (shouldFail()) {
      throw new Error('Ошибка удаления задачи');
    }

    const taskIndex = tasksStorage.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new Error('Задача не найдена');
    }

    tasksStorage.splice(taskIndex, 1);
  },
};