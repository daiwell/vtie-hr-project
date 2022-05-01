import axios from 'axios';

const request =axios.create({
    baseURL:'http://api-toutiao-web.itheima.net',
    timeout:5000
})

// request.interceptors.request(request=>{
//     return request;
// },err=>{

//     return Promise.reject(err)
// })
export default request