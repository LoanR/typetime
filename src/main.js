import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import VueRouter from 'vue-router';
import router from './router';
import SocialSharing from 'vue-social-sharing';
import store from './store/index';

Vue.use(VueRouter);
Vue.use(SocialSharing);
Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
    store,
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
}).$mount('#app');
