import request from './request.js'
export const loginApi =(data)=>{
    return request({
        method:'POST',
        url:'/mp/v1_0/authorizations',
        data
    })
}

export const getUserProfile =(data)=>{
    return request({
        method:'GET',
        url:'/mp/v1_0/user/profile',
    })
}