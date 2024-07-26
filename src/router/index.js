import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Admin from '../views/Admin.vue';
import PasswordPrompt from '../views/PasswordPrompt.vue'; // Importieren Sie die Passwort-Eingabekomponente

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
    },
    {
        path: '/password-prompt',
        name: 'password-prompt',
        component: PasswordPrompt
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const storedPassword = localStorage.getItem('admin-password');
        if (storedPassword) {
            next();
        } else {
            next('/password-prompt'); // Weiterleiten zur Passwort-Eingabeseite
        }
    } else {
        next();
    }
});

export default router;
