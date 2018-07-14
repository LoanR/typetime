import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import About from '@/components/About';

Vue.use(Router);

const routes = [
    {path: '/', component: Landing, meta: {depth: 0}},
    {path: '/typetime', component: Landing, meta: {depth: 0}}, // gh-pages special cases
    {path: '/typetime/about', component: About, meta: {depth: -1}},
];

export default new Router({
    routes,
    mode: 'history',
});
