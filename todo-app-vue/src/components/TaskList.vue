<template>
  <div class="task-list">
    <!-- Состояние загрузки -->
    <div v-if="loading && filteredTasks.length === 0" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Загрузка задач...</p>
    </div>
    
    <!-- Пустой список -->
    <div v-else-if="!loading && filteredTasks.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2" stroke-dasharray="8 4"/>
          <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M32 20v12M32 36v4"/>
          <circle cx="32" cy="44" r="2" fill="currentColor"/>
        </svg>
      </div>
      <h3 class="empty-title">{{ getEmptyStateTitle() }}</h3>
      <p class="empty-description">{{ getEmptyStateDescription() }}</p>
    </div>
    
    <!-- Список задач -->
    <div v-else class="tasks-container">
      <transition-group name="task-list" tag="div" class="tasks-grid">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          class="task-item-wrapper"
        />
      </transition-group>
      
      <!-- Индикатор загрузки при обновлении списка -->
      <div v-if="loading" class="updating-indicator">
        <div class="updating-spinner"></div>
        <span class="updating-text">Обновление...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import TaskItem from './TaskItem.vue'
import type { Task, FilterType } from '@/types'

// Получаем store через getCurrentInstance
const instance = getCurrentInstance()
const store = instance?.proxy?.$store

// Вычисляемые свойства
const loading = computed(() => store.state.tasks.loading)
const filteredTasks = computed(() => store.getters['tasks/FILTERED_TASKS'] as Task[])
const currentFilter = computed(() => store.state.tasks.filter as FilterType)
const allTasksCount = computed(() => store.getters['tasks/TASKS_COUNT'] as number)

// Методы для пустого состояния
const getEmptyStateTitle = (): string => {
  if (allTasksCount.value === 0) {
    return 'Пока нет задач'
  }
  
  switch (currentFilter.value) {
    case 'active':
      return 'Нет активных задач'
    case 'completed':
      return 'Нет выполненных задач'
    default:
      return 'Нет задач'
  }
}

const getEmptyStateDescription = (): string => {
  if (allTasksCount.value === 0) {
    return 'Добавьте первую задачу, чтобы начать планирование'
  }
  
  switch (currentFilter.value) {
    case 'active':
      return 'Все задачи выполнены! Отличная работа 🎉'
    case 'completed':
      return 'Еще нет выполненных задач'
    default:
      return 'Список задач пуст'
  }
}
</script>

<style scoped>
.task-list {
  width: 100%;
}

/* Состояние загрузки */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Пустое состояние */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #d1d5db;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  max-width: 300px;
  line-height: 1.5;
}

/* Контейнер задач */
.tasks-container {
  position: relative;
}

.tasks-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item-wrapper {
  width: 100%;
}

/* Индикатор обновления */
.updating-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: absolute;
  top: -2.5rem;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  backdrop-filter: blur(4px);
  animation: slideDown 0.3s ease;
}

.updating-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.updating-text {
  font-weight: 500;
}

/* Анимации */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Анимации списка задач */
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-list-move {
  transition: transform 0.3s ease;
}

/* Адаптивность */
@media (max-width: 640px) {
  .loading-state,
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .empty-title {
    font-size: 1.125rem;
  }
  
  .empty-description {
    font-size: 0.925rem;
  }
  
  .tasks-grid {
    gap: 0.5rem;
  }
  
  .updating-indicator {
    position: static;
    margin-bottom: 1rem;
    justify-self: center;
  }
}
</style> 