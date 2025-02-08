import "@/assets/tailwind.css";
import '@/assets/main.css'


import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue, {
    theme: 'none'
});

app.use(createPinia())
app.use(router)

app.mount('#app')
