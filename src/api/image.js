import request from './request'

export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}
//更改图片收藏状态
export const changeCollectImage = (iamgeID, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${iamgeID}`,
    data: {
      collect
    }
  })
}
//删除图片素材
export const deleteImage = (iamgeID) => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${iamgeID}`,

  })
}
