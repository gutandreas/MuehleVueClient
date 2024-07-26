import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Admin from '../views/Admin.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: { requiresAuth: true } // Optional, wenn Authentifizierung benötigt wird
    }
    // Füge hier weitere Routen hinzu
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
