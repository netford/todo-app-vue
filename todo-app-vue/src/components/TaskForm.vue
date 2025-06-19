<template>
  <div class="task-form">
    <form @submit.prevent="submitTask" class="form">
      <div class="input-group">
        <input
          v-model="taskTitle"
          type="text"
          placeholder="Введите название задачи..."
          class="task-input"
          :class="{ 'input-error': hasError }"
          :disabled="loading"
          maxlength="200"
        />
        <button
          type="submit"
          class="submit-btn"
          :disabled="!canSubmit"
          :class="{ 'btn-loading': loading }"
        >
          <span v-if="!loading" class="btn-text">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>
            </svg>
            Добавить
          </span>
          <span v-else class="btn-loading-content">
            <div class="spinner"></div>
            Добавление...
          </span>
        </button>
      </div>
      <div v-if="hasError" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'
import type { CreateTaskDto } from '@/types'

// Получаем store через getCurrentInstance
const instance = getCurrentInstance()
const store = instance?.proxy?.$store

// Реактивные данные
const taskTitle = ref('')
const hasError = ref(false)
const errorMessage = ref('')

// Вычисляемые свойства
const loading = computed(() => store.state.tasks.loading)
const canSubmit = computed(() => taskTitle.value.trim().length > 0 && !loading.value)

// Методы
const clearError = () => {
  hasError.value = false
  errorMessage.value = ''
}

const showError = (message: string) => {
  hasError.value = true
  errorMessage.value = message
  setTimeout(clearError, 3000) // Автоматически скрыть ошибку через 3 секунды
}

const validateTask = (): boolean => {
  const title = taskTitle.value.trim()
  
  if (!title) {
    showError('Название задачи не может быть пустым')
    return false
  }
  
  if (title.length < 2) {
    showError('Название задачи должно содержать минимум 2 символа')
    return false
  }
  
  if (title.length > 200) {
    showError('Название задачи не может превышать 200 символов')
    return false
  }
  
  return true
}

const submitTask = async () => {
  clearError()
  
  if (!validateTask()) {
    return
  }
  
  try {
    const taskData: CreateTaskDto = {
      title: taskTitle.value.trim()
    }
    
    await store.dispatch('tasks/CREATE_TASK', taskData)
    
    // Очистить поле после успешного добавления
    taskTitle.value = ''
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка при создании задачи'
    showError(message)
  }
}
</script>

<style scoped>
.task-form {
  width: 100%;
  margin-bottom: 2rem;
}

.form {
  width: 100%;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.task-input {
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
  color: #374151;
}

.task-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.task-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.task-input.input-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  white-space: nowrap;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-loading-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  animation: slideDown 0.3s ease;
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

/* Адаптивность */
@media (max-width: 640px) {
  .input-group {
    flex-direction: column;
  }
  
  .submit-btn {
    width: 100%;
    min-width: auto;
  }
  
  .task-input {
    padding: 0.875rem 1rem;
  }
}
</style>
