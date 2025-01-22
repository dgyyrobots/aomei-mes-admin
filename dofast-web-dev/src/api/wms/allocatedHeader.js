import request from '@/utils/request'

// 创建调拨单头
export function createAllocatedHeader(data) {
  return request({
    url: '/wms/allocated-header/create',
    method: 'post',
    data: data
  })
}

// 更新调拨单头
export function updateAllocatedHeader(data) {
  return request({
    url: '/wms/allocated-header/update',
    method: 'put',
    data: data
  })
}

// 删除调拨单头
export function deleteAllocatedHeader(id) {
  return request({
    url: '/wms/allocated-header/delete?id=' + id,
    method: 'delete'
  })
}

// 获得调拨单头
export function getAllocatedHeader(id) {
  return request({
    url: '/wms/allocated-header/get?id=' + id,
    method: 'get'
  })
}

// 获得调拨单头分页
export function getAllocatedHeaderPage(query) {
  return request({
    url: '/wms/allocated-header/page',
    method: 'get',
    params: query
  })
}

// 导出调拨单头 Excel
export function exportAllocatedHeaderExcel(query) {
  return request({
    url: '/wms/allocated-header/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获取Bom信息
export function initBomInfo(data) {
  return request({
    url: '/wms/allocated-header/initBom',
    method: 'post',
    data: data
  })
}

//执行出库
export function execute(allocatedId) {
  return request({
    url: '/wms/allocated-header/' + allocatedId,
    method: 'put',
  });
}


// 更新调拨单头
export function finshAllocatedHeader(id) {
  return request({
    url: '/wms/allocated-header/finsh?id=' + id,
    method: 'get',
  })
}

// 绑定调拨信息
export function updateAllocatedLine(data) {
  return request({
    url: '/wms/allocated-line/updateLine',
    method: 'post',
    data: data
  })
}
