# Vue 3 TODO Планировщик

Современное TODO приложение, созданное с использованием Vue 3, TypeScript, Vuex 4 и Composition API.

## 🚀 Особенности

- **Vue 3 + Composition API** - Современный подход к разработке
- **TypeScript** - Строгая типизация для надежности кода
- **Vuex 4** - Централизованное управление состоянием
- **Красивый дизайн** - Современный минималистичный интерфейс
- **Адаптивность** - Отлично работает на всех устройствах
- **Анимации** - Плавные переходы и эффекты
- **Доступность** - Поддержка screen readers и клавиатурной навигации

## 🏗️ Архитектура

```
src/
├── components/           # Vue компоненты
│   ├── TaskForm.vue     # Форма добавления задач
│   ├── TaskItem.vue     # Отдельная задача
│   ├── TaskList.vue     # Список задач
│   └── TaskFilters.vue  # Фильтры задач
├── store/               # Vuex store
│   ├── modules/
│   │   └── tasks.ts     # Модуль задач
│   ├── types.ts         # Типы для store
│   └── index.ts         # Корневой store
├── api/                 # API слой
│   └── tasks.ts         # API для работы с задачами
├── types/               # TypeScript типы
│   └── index.ts         # Общие типы
└── assets/              # Статические ресурсы
    └── main.css         # Глобальные стили
```

## 🎯 Функциональность

### ✅ Управление задачами
- Добавление новых задач
- Отметка задач как выполненных
- Удаление задач
- Валидация ввода

### 🔍 Фильтрация
- Просмотр всех задач
- Фильтр активных задач
- Фильтр выполненных задач
- Счетчики задач

### 📊 Статистика
- Общее количество задач
- Количество активных задач
- Процент выполнения
- Прогресс-бар

### 🎨 UI/UX
- Состояния загрузки
- Обработка ошибок
- Анимации добавления/удаления
- Уведомления об ошибках

## 🛠️ Tech Stack

- **Vue 3** - Прогрессивный JavaScript фреймворк
- **TypeScript** - Статическая типизация
- **Vuex 4** - Управление состоянием
- **Vite** - Быстрый сборщик
- **CSS3** - Современные стили с градиентами и анимациями

## 🚀 Запуск проекта

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

### Предварительный просмотр сборки
```bash
npm run preview
```

## 📱 Компоненты

### TaskForm.vue
Форма для добавления новых задач с валидацией:
- Проверка на пустые значения
- Ограничение длины (2-200 символов)
- Состояние загрузки
- Автоочистка после добавления

### TaskItem.vue
Компонент отдельной задачи:
- Чекбокс для изменения статуса
- Зачеркивание выполненных задач
- Кнопка удаления с подтверждением
- Анимации состояний

### TaskList.vue
Список всех задач:
- Отображение отфильтрованных задач
- Состояние загрузки
- Пустое состояние
- Анимированные переходы

### TaskFilters.vue
Панель фильтрации и статистики:
- Переключение между фильтрами
- Счетчики задач
- Прогресс выполнения
- Красивые индикаторы

## 🎨 Дизайн

Приложение использует современный дизайн с:
- Градиентным фоном
- Полупрозрачными элементами
- Размытием (backdrop-filter)
- Тенями и эффектами глубины
- Плавными анимациями
- Адаптивной версткой

## 🔧 Настройка

Проект использует следующие конфигурации:
- `tsconfig.json` - настройки TypeScript
- `vite.config.ts` - конфигурация Vite
- `package.json` - зависимости и скрипты

## 📝 Лицензия

MIT License

## 👨‍💻 Автор

Создано как демонстрация современных подходов к разработке на Vue 3 с TypeScript.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
