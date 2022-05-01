import Vue from "vue";
import App from "./App.vue"

import router from './router/index.js'
import store  from "./store";
import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App)
}).$mount();
