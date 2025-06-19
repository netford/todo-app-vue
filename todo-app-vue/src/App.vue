<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import TaskForm from '@/components/TaskForm.vue'
import TaskFilters from '@/components/TaskFilters.vue'
import TaskList from '@/components/TaskList.vue'

// Подключение Vuex store
const store = useStore()

// Вычисляемые свойства для отслеживания состояния
const error = computed(() => store.state.tasks.error)
const loading = computed(() => store.state.tasks.loading)

// Методы для управления ошибками
const clearError = () => {
  store.commit('tasks/CLEAR_ERROR')
}

// Загрузка задач при монтировании компонента
onMounted(async () => {
  try {
    await store.dispatch('tasks/FETCH_TASKS')
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error)
  }
})
</script>

<template>
  <div id="app">
    <div class="container">
      <!-- Заголовок приложения -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h1 class="app-title">TODO Планировщик</h1>
          </div>
          <div class="header-subtitle">
            Организуйте свои задачи эффективно
          </div>
        </div>
      </header>

      <!-- Основной контент -->
      <main class="main-content">
        <!-- Форма добавления задач -->
        <section class="form-section">
          <div class="section-header">
            <h2 class="section-title">Добавить новую задачу</h2>
          </div>
          <TaskForm />
        </section>

        <!-- Фильтры и статистика -->
        <section class="filters-section">
          <div class="section-header">
            <h2 class="section-title">Фильтры и статистика</h2>
          </div>
          <TaskFilters />
        </section>

        <!-- Список задач -->
        <section class="tasks-section">
          <div class="section-header">
            <h2 class="section-title">Список задач</h2>
          </div>
          <TaskList />
        </section>

        <!-- Индикатор загрузки -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
              </circle>
            </svg>
            <p class="loading-text">Загрузка...</p>
          </div>
        </div>
      </main>

      <!-- Обработка ошибок -->
      <div v-if="error" class="error-banner">
        <div class="error-content">
          <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="error-text">
            <strong>Ошибка:</strong> {{ error }}
          </div>
          <button @click="clearError" class="error-close" aria-label="Закрыть ошибку">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Футер -->
      <footer class="app-footer">
        <p class="footer-text">
          Создано с ❤️ используя Vue 3 + TypeScript + Vuex
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Основные стили приложения */
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Заголовок приложения */
.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

/* Основной контент */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

/* Секции */
.form-section,
.filters-section,
.tasks-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  background: rgba(59, 130, 246, 0.1);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1rem 1.5rem;
  border-radius: 16px 16px 0 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.form-section > :deep(.task-form),
.filters-section > :deep(.task-filters),
.tasks-section > :deep(.task-list) {
  padding: 1.5rem;
}

.tasks-section {
  flex: 1;
  min-height: 300px;
}

/* Индикатор загрузки */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  animation: rotate 2s linear infinite;
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

/* Баннер ошибки */
.error-banner {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  animation: slideInRight 0.3s ease;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  max-width: 400px;
}

.error-icon {
  width: 20px;
  height: 20px;
  color: #dc2626;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
  color: #dc2626;
  font-size: 0.875rem;
  line-height: 1.4;
}

.error-close {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #dc2626;
  border-radius: 4px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.error-close:hover {
  background: rgba(239, 68, 68, 0.1);
}

.error-close svg {
  width: 16px;
  height: 16px;
}

/* Футер */
.app-footer {
  text-align: center;
  padding: 2rem 0 1rem;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0;
}

/* Анимации */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .logo-section {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .header-content {
    padding: 1.5rem;
  }
  
  .main-content {
    gap: 1.5rem;
  }
  
  .section-header {
    padding: 0.75rem 1rem;
  }
  
  .form-section > :deep(.task-form),
  .filters-section > :deep(.task-filters),
  .tasks-section > :deep(.task-list) {
    padding: 1rem;
  }
  
  .error-banner {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
  
  .error-content {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0.75rem;
  }
  
  .app-title {
    font-size: 1.75rem;
  }
  
  .header-subtitle {
    font-size: 1rem;
  }
  
  .main-content {
    gap: 1rem;
  }
  
  .section-header {
    border-radius: 12px 12px 0 0;
  }
  
  .form-section,
  .filters-section,
  .tasks-section {
    border-radius: 12px;
  }
  
  .header-content {
    border-radius: 16px;
    padding: 1.25rem;
  }
}
</style>
