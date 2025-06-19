import { createApp } from 'vue';
import App from './App.vue';
import { store } from './store';

// Импорт базовых стилей
import './assets/main.css';

// Создание и настройка Vue приложения
const app = createApp(App);

// Подключение Vuex store
app.use(store);

// Монтирование приложения
app.mount('#app');