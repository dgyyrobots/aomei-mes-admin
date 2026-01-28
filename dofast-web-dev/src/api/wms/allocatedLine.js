import request from '@/utils/request'

// 创建调拨单身
export function createAllocatedLine(data) {
  return request({
    url: '/wms/allocated-line/create',
    method: 'post',
    data: data
  })
}

// 更新调拨单身
export function updateAllocatedLine(data) {
  return request({
    url: '/wms/allocated-line/update',
    method: 'put',
    data: data
  })
}

// 删除调拨单身
export function deleteAllocatedLine(id) {
  return request({
    url: '/wms/allocated-line/delete?id=' + id,
    method: 'delete'
  })
}

// 获得调拨单身
export function getAllocatedLine(id) {
  return request({
    url: '/wms/allocated-line/get?id=' + id,
    method: 'get'
  })
}

// 获得调拨单身分页
export function getAllocatedLinePage(query) {
  return request({
    url: '/wms/allocated-line/page',
    method: 'get',
    params: query
  })
}

// 导出调拨单身 Excel
export function exportAllocatedLineExcel(query) {
  return request({
    url: '/wms/allocated-line/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


