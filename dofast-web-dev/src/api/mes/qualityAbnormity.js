import request from '@/utils/request'

// 创建品质异常信息
export function createQualityAbnormity(data) {
  return request({
    url: '/mes/quality-abnormity/create',
    method: 'post',
    data: data
  })
}

// 更新品质异常信息
export function updateQualityAbnormity(data) {
  return request({
    url: '/mes/quality-abnormity/update',
    method: 'put',
    data: data
  })
}

// 删除品质异常信息
export function deleteQualityAbnormity(id) {
  return request({
    url: '/mes/quality-abnormity/delete?id=' + id,
    method: 'delete'
  })
}

// 获得品质异常信息
export function getQualityAbnormity(id) {
  return request({
    url: '/mes/quality-abnormity/get?id=' + id,
    method: 'get'
  })
}

// 获得品质异常信息分页
export function getQualityAbnormityPage(query) {
  return request({
    url: '/mes/quality-abnormity/page',
    method: 'get',
    params: query
  })
}

// 导出品质异常信息 Excel
export function exportQualityAbnormityExcel(query) {
  return request({
    url: '/mes/quality-abnormity/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
