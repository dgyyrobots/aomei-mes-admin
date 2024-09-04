import request from '@/utils/request'

// 创建会员积分
export function createPointConfig(data) {
  return request({
    url: '/member/point-config/create',
    method: 'post',
    data: data
  })
}

// 更新会员积分
export function updatePointConfig(data) {
  return request({
    url: '/member/point-config/update',
    method: 'put',
    data: data
  })
}

// 删除会员积分
export function deletePointConfig(id) {
  return request({
    url: '/member/point-config/delete?id=' + id,
    method: 'delete'
  })
}

// 获得会员积分
export function getPointConfig(id) {
  return request({
    url: '/member/point-config/get?id=' + id,
    method: 'get'
  })
}

// 获得会员积分分页
export function getPointConfigPage(query) {
  return request({
    url: '/member/point-config/page',
    method: 'get',
    params: query
  })
}

// 导出会员积分 Excel
export function exportPointConfigExcel(query) {
  return request({
    url: '/member/point-config/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
