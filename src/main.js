import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import stompService from "./stomp/stompService"; // Importiere das WebSocket-Plugin
import store from "./store";

const app = createApp(App);

app.config.globalProperties.$hostname = 'http://localhost:8081';

stompService.connect('http://localhost:8081/ws')
    .then(() => {
        console.log('WebSocket connection established.');

        // Verwende den Router und mounte die App erst nach erfolgreicher Verbindung
        app.use(router);
        app.use(store);
        app.mount('#app');

        // Optional: Initialisiere oder abonniere WebSocket-Nachrichten hier, falls erforderlich
    })
    .catch((error) => {
        console.error('Failed to establish WebSocket connection:', error);
    });


