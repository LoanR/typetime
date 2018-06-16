import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import router from './router';

Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
}).$mount('#app');
