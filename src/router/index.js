import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import About from '@/components/About';

Vue.use(Router);

const routes = [
    {path: '/', component: Landing, meta: {depth: 0}},
    {path: '/Typetime-front', component: Landing, meta: {depth: 0}}, // gh-pages landing special case
    {path: '/about', component: About, meta: {depth: -1}},
];

export default new Router({
    routes,
    mode: 'history',
});
