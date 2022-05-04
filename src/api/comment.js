import request from './request.js'
export const getComment =(data)=>{
    return request({
        method:'GET',
        url:'/mp/v1_0/articles',
        params:{
            ...data,
            response_type:'comment'
        }
       
    })
}

export const updateCommentStatus =(article_id,allow_comment)=>{
    return request({
        method:'PUT',
        url:'/mp/v1_0/comments/status',
        params:{
            article_id
        },
        data:{
            allow_comment
        }
       
    })
}