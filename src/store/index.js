import Vue from 'vue'
import Vuex from 'vuex'
import { getItem } from '@/utils/storage'


//从本地存储中获取用户信息
let TOKEN =getItem('userInfo') ? getItem('userInfo').token : null; 
console.log(TOKEN);
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
        userToken: TOKEN
    },
    getters: {
        count(state) {
            return state.count;
        }
    },
    mutations: {
        setUserToken(state,val){
            state.userToken=val.token
        }
    },
    actions: {}
})

