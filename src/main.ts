import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from '@/router';

import './styles.css';
import { useAppStore } from './store/app-store';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const appStore = useAppStore();
appStore.init();

app.use(router);

app.mount('#app');
