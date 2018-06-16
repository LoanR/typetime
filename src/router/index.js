import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import About from '@/components/About';

Vue.use(Router);

const routes = [
    {path: '/', component: Landing},
    {path: '/Typetime-front', component: Landing}, // gh-pages landing special case
    {path: '/about', component: About},
];

export default new Router({
    routes,
    mode: 'history',
});
