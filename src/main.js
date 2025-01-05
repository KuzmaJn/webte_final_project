import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
//import './registerServiceWorker'
const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // Pripojenie Pinia k aplikácii
app.use(router); // Pripojenie routera
app.mount('#app'); // Mount aplikácie
