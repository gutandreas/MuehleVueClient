import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import WebSocketPlugin from './plugins/websocket'; // Importiere das WebSocket-Plugin

const app = createApp(App);

app.config.globalProperties.$hostname = 'http://localhost:8081';
app.config.globalProperties.$gameWebsocketUrl = 'ws://localhost:8081/websocket/game';
app.config.globalProperties.$adminWebsocketUrl = 'ws://localhost:8081/websocket/admin';

// Verwende das WebSocket-Plugin
app.use(WebSocketPlugin);

// Router verwenden
app.use(router);

// Montiere die App
app.mount('#app');
