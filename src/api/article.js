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

//增加文章
export const addArticle=(data,draft=false)=>{
    return request({
        method:'POST',
        url:'/mp/v1_0/articles',
        data,
        params:{
            draft 
        }

    })
}


//增加文章
export const getArticle=articleId=>{
    return request({
        method:'GET',
        url:`/mp/v1_0/articles/${articleId}`,
       

    })
}

//增加文章
export const updateArticle=(articleId,data,draft=false)=>{
    return request({
        method:'PUT',
        url:`/mp/v1_0/articles/${articleId}`,
        params:{
            draft
        },
        data
       

    })
}
//上传图片使base64图片格式变成http链接的形式
export const uploadImage = data => {
    return request({
      method: 'POST',
      url: '/mp/v1_0/user/images',
      // 一般文件上传的接口都要求把请求头中的 Content-Type 设置为 multipart/form-data，但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可。
      // new FormData()
      data
    })
  }

