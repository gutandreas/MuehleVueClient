import { createApp } from 'vue'
import App from './App.vue'
import WebSocketPlugin from './plugins/websocket'

// Erstelle die Vue-App
const app = createApp(App)

// Definiere die globale Eigenschaft
app.config.globalProperties.$hostname = 'http://localhost:8081'
app.config.globalProperties.$websocketUrl = 'ws://localhost:8081'

// WebSocket Plugin verwenden
app.use(WebSocketPlugin, { url: 'ws://localhost:8081/websocket' });

// Montiere die App
app.mount('#app')