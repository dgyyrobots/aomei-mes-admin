import request from '@/utils/request'

// 创建调拨单身记录
export function createAllocatedRecord(data) {
  return request({
    url: '/wms/allocated-record/create',
    method: 'post',
    data: data
  })
}

// 更新调拨单身记录
export function updateAllocatedRecord(data) {
  return request({
    url: '/wms/allocated-record/update',
    method: 'put',
    data: data
  })
}

// 删除调拨单身记录
export function deleteAllocatedRecord(id) {
  return request({
    url: '/wms/allocated-record/delete?id=' + id,
    method: 'delete'
  })
}

// 获得调拨单身记录
export function getAllocatedRecord(id) {
  return request({
    url: '/wms/allocated-record/get?id=' + id,
    method: 'get'
  })
}

// 获得调拨单身记录
export function getAllocatedRecordByHeaderId(id) {
  return request({
    url: '/wms/allocated-record/getByHeaderId?id=' + id,
    method: 'get'
  })
}

// 获得调拨单身记录分页
export function getAllocatedRecordPage(query) {
  return request({
    url: '/wms/allocated-record/page',
    method: 'get',
    params: query
  })
}

// 导出调拨单身记录 Excel
export function exportAllocatedRecordExcel(query) {
  return request({
    url: '/wms/allocated-record/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
