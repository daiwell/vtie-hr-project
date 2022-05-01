import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue' // 引入 Home页面组件

// 注册路由插件
Vue.use(VueRouter)

// 
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
]

const router = new VueRouter({
    routes
})

export default router