import 'reset-css';
import 'amfe-flexible';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
Vue.config.productionTip = false;
import touch from "../lib";
Vue.use(touch);
const app = new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

