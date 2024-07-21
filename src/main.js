import { createApp } from 'vue'
import App from './App.vue'

// Erstelle die Vue-App
const app = createApp(App)

// Definiere die globale Eigenschaft
app.config.globalProperties.$hostname = 'http://localhost:8081'

// Montiere die App
app.mount('#app')