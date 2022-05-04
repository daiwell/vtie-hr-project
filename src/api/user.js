import request from './request.js'
export const loginApi =(data)=>{
    return request({
        method:'POST',
        url:'/mp/v1_0/authorizations',
        data
    })
}

//得到用户信息
export const getUserProfile =(data)=>{
    return request({
        method:'GET',
        url:'/mp/v1_0/user/profile',
    })
}
// /mp/v1_0/user/profile
export const updateUserProfile =(data)=>{
    return request({
        method:'PATCH',
        url:'/mp/v1_0/user/profile',
        data
    })
}