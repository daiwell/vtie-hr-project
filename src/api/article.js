import request from './request'

//获取文章全部数据
export const getArticles=params=>{
    return request({
        method:'GET',
        url:'/mp/v1_0/articles',
        params
    })
}
//获取文章频道
export const getArticleChanels=params=>{
    return request({
        method:'GET',
        url:'/mp/v1_0/channels',
    })
}
//删除文章
export const deleteArticle=articleID=>{
    return request({
        method:'DELETE',
        url:`/mp/v1_0/articles/${articleID}`,
    })
}




