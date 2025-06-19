<template>
  <div class="task-item" :class="{ 'task-completed': task.completed }">
    <div class="task-content">
      <label class="checkbox-container">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTask"
          :disabled="loading"
          class="checkbox-input"
        />
        <span class="checkbox-custom">
          <svg v-if="task.completed" class="check-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
      </label>
      
      <span class="task-title" :class="{ 'task-title-completed': task.completed }">
        {{ task.title }}
      </span>
    </div>
    
    <button
      @click="deleteTask"
      :disabled="loading"
      class="delete-btn"
      :title="`Удалить задачу: ${task.title}`"
    >
      <svg class="delete-icon" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m18 6-12 12M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import type { Task } from '@/types'

// Props
const props = defineProps<{
  task: Task
}>()

// Получаем store через getCurrentInstance
const instance = getCurrentInstance()
const store = instance?.proxy?.$store

// Вычисляемые свойства
const loading = computed(() => store.state.tasks.loading)

// Методы
const toggleTask = async () => {
  try {
    await store.dispatch('tasks/TOGGLE_TASK', props.task.id)
  } catch (error) {
    console.error('Ошибка при изменении статуса задачи:', error)
  }
}

const deleteTask = async () => {
  if (confirm(`Вы действительно хотите удалить задачу "${props.task.title}"?`)) {
    try {
      await store.dispatch('tasks/DELETE_TASK', props.task.id)
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error)
    }
  }
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  animation: slideIn 0.3s ease;
}

.task-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.task-completed {
  background: #f9fafb;
  border-color: #e5e7eb;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0; /* Для правильного переноса текста */
}

.checkbox-container {
  position: relative;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  transition: all 0.2s ease;
}

.checkbox-input:checked ~ .checkbox-custom {
  background: #22c55e;
  border-color: #22c55e;
  color: white;
}

.checkbox-input:focus ~ .checkbox-custom {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.checkbox-input:disabled ~ .checkbox-custom {
  background: #f3f4f6;
  border-color: #e5e7eb;
  cursor: not-allowed;
}

.check-icon {
  width: 12px;
  height: 12px;
  animation: checkScale 0.2s ease;
}

@keyframes checkScale {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.task-title {
  font-size: 1rem;
  color: #374151;
  word-break: break-word;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.task-title-completed {
  color: #9ca3af;
  text-decoration: line-through;
  text-decoration-color: #d1d5db;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #9ca3af;
  flex-shrink: 0;
}

.delete-btn:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
  transform: scale(1.05);
}

.delete-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.delete-icon {
  width: 16px;
  height: 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Адаптивность */
@media (max-width: 640px) {
  .task-item {
    padding: 1rem;
  }
  
  .task-content {
    gap: 0.75rem;
  }
  
  .task-title {
    font-size: 0.925rem;
  }
  
  .delete-btn {
    width: 32px;
    height: 32px;
  }
  
  .delete-icon {
    width: 14px;
    height: 14px;
  }
}
</style> 