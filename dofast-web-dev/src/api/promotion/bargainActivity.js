import request from '@/utils/request'

// 创建砍价商品
export function createBargainActivity(data) {
  return request({
    url: '/promotion/bargain-activity/create',
    method: 'post',
    data: data
  })
}

// 更新砍价商品
export function updateBargainActivity(data) {
  return request({
    url: '/promotion/bargain-activity/update',
    method: 'put',
    data: data
  })
}

// 删除砍价商品
export function deleteBargainActivity(id) {
  return request({
    url: '/promotion/bargain-activity/delete?id=' + id,
    method: 'delete'
  })
}

// 获得砍价商品
export function getBargainActivity(id) {
  return request({
    url: '/promotion/bargain-activity/get?id=' + id,
    method: 'get'
  })
}

// 获得砍价商品分页
export function getBargainActivityPage(query) {
  return request({
    url: '/promotion/bargain-activity/page',
    method: 'get',
    params: query
  })
}

// 导出砍价商品 Excel
export function exportBargainActivityExcel(query) {
  return request({
    url: '/promotion/bargain-activity/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
