import request from '@/utils/request'

// 创建商品评论
export function createComment(data) {
  return request({
    url: '/product/comment/create',
    method: 'post',
    data: data
  })
}

// 更新商品评论
export function updateComment(data) {
  return request({
    url: '/product/comment/update',
    method: 'put',
    data: data
  })
}

// 删除商品评论
export function deleteComment(id) {
  return request({
    url: '/product/comment/delete?id=' + id,
    method: 'delete'
  })
}

// 获得商品评论
export function getComment(id) {
  return request({
    url: '/product/comment/get?id=' + id,
    method: 'get'
  })
}

// 获得商品评论分页
export function getCommentPage(query) {
  return request({
    url: '/product/comment/page',
    method: 'get',
    params: query
  })
}

// 导出商品评论 Excel
export function exportCommentExcel(query) {
  return request({
    url: '/product/comment/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
