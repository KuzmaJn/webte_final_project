import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import HowToPlay from '../components/HowToPlay.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/how-to-play',
        name: 'HowToPlay',
        component: HowToPlay,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
