import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import router from './router';
import SocialSharing from 'vue-social-sharing';

Vue.use(VueRouter);
Vue.use(SocialSharing);

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
}).$mount('#app');
