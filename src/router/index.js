import Vue from 'vue'
import store from '../store/index.js'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
const Home = () => import('@/views/home/index.vue')
const Layout = () => import('@/views/layout/index.vue')
const Article = () => import('@/views/article/index.vue')

console.log(store.state.userToken);
// 注册路由插件
Vue.use(VueRouter)

// 
const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        // name: 'login', //命名视图有默认子路由，设置name没有任何一样
        component: Layout,
        children: [
            {
                path: '', //路径为空，则表示为默认子路由
                name: 'home',
                component: Home
            },
            {
                path: '/article', 
                name: 'article',
                component: Article
            },
        ]
    },
    {
        path: '/',
        name: 'home',
        component: Home
    },
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path !== '/login') {
        // console.log(store);
        if (store.state.userToken) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})
export default router