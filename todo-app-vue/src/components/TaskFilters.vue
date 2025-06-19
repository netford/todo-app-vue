<template>
  <div class="task-filters">
    <div class="filters-header">
      <h2 class="filters-title">Фильтры задач</h2>
      <div class="total-counter">
        Всего: <span class="counter-value">{{ totalCount }}</span>
      </div>
    </div>
    
    <div class="filters-buttons">
      <button
        v-for="filter in filterOptions"
        :key="filter.value"
        @click="setFilter(filter.value)"
        :class="[
          'filter-btn',
          { 'filter-btn-active': currentFilter === filter.value }
        ]"
        :title="`Показать ${filter.label.toLowerCase()}`"
      >
        <span class="filter-icon" v-html="filter.icon"></span>
        <span class="filter-label">{{ filter.label }}</span>
        <span class="filter-counter">{{ getFilterCount(filter.value) }}</span>
      </button>
    </div>
    
    <!-- Статистика -->
    <div class="stats-summary" v-if="totalCount > 0">
      <div class="stat-item">
        <div class="stat-circle active"></div>
        <span class="stat-text">Активные: {{ activeCount }}</span>
      </div>
      <div class="stat-item">
        <div class="stat-circle completed"></div>
        <span class="stat-text">Выполнено: {{ completedCount }}</span>
      </div>
      <div class="stat-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ progressPercentage }}% готово</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import type { FilterType } from '@/types'

// Получаем store через getCurrentInstance
const instance = getCurrentInstance()
const store = instance?.proxy?.$store

// Опции фильтров
interface FilterOption {
  value: FilterType
  label: string
  icon: string
}

const filterOptions: FilterOption[] = [
  {
    value: 'all',
    label: 'Все',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>'
  },
  {
    value: 'active',
    label: 'Активные',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" /></svg>'
  },
  {
    value: 'completed',
    label: 'Выполненные',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
  }
]

// Вычисляемые свойства
const currentFilter = computed(() => store.state.tasks.filter as FilterType)
const totalCount = computed(() => store.getters['tasks/TASKS_COUNT'] as number)
const activeCount = computed(() => store.getters['tasks/ACTIVE_TASKS_COUNT'] as number)
const completedCount = computed(() => store.getters['tasks/COMPLETED_TASKS_COUNT'] as number)

const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// Методы
const setFilter = (filter: FilterType) => {
  store.dispatch('tasks/SET_FILTER', filter)
}

const getFilterCount = (filter: FilterType): number => {
  switch (filter) {
    case 'all':
      return totalCount.value
    case 'active':
      return activeCount.value
    case 'completed':
      return completedCount.value
    default:
      return 0
  }
}
</script>

<style scoped>
.task-filters {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.filters-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.total-counter {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.counter-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.75rem;
  margin-left: 0.25rem;
  padding: 0 0.25rem;
}

.filters-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  font-weight: 500;
  gap: 0.5rem;
}

.filter-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.filter-btn-active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: #3b82f6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.filter-btn-active:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #2563eb;
}

.filter-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.filter-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.filter-label {
  flex: 1;
  text-align: left;
  font-size: 0.925rem;
}

.filter-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.filter-btn:not(.filter-btn-active) .filter-counter {
  background: #e5e7eb;
  color: #6b7280;
}

.stats-summary {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.stat-item:last-of-type {
  margin-bottom: 1rem;
}

.stat-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-circle.active {
  background: #f59e0b;
}

.stat-circle.completed {
  background: #22c55e;
}

.stat-text {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.stat-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  min-width: 60px;
  text-align: right;
}

/* Адаптивность */
@media (max-width: 768px) {
  .task-filters {
    padding: 1.25rem;
  }
  
  .filters-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
  
  .filters-buttons {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.875rem;
  }
  
  .filter-label {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .stat-progress {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .progress-text {
    text-align: center;
    min-width: auto;
  }
}
</style> 