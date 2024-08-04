import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import stompService from "./stomp/stompService"; // Importiere das WebSocket-Plugin

const app = createApp(App);

app.config.globalProperties.$hostname = 'http://localhost:8081';



stompService.connect('http://localhost:8081/ws');
// Verwende das WebSocket-Plugin
//app.use(WebSocketPlugin);

// Router verwenden
app.use(router);

// Montiere die App
app.mount('#app');
