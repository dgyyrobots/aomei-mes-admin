import request from '@/utils/request'

// 创建制版房领料单头
export function createElectroformHeader(data) {
  return request({
    url: '/wms/electroform-header/create',
    method: 'post',
    data: data
  })
}

// 更新制版房领料单头
export function updateElectroformHeader(data) {
  return request({
    url: '/wms/electroform-header/update',
    method: 'put',
    data: data
  })
}

// 删除制版房领料单头
export function deleteElectroformHeader(id) {
  return request({
    url: '/wms/electroform-header/delete?id=' + id,
    method: 'delete'
  })
}

// 获得制版房领料单头
export function getElectroformHeader(id) {
  return request({
    url: '/wms/electroform-header/get?id=' + id,
    method: 'get'
  })
}

// 获得制版房领料单头分页
export function getElectroformHeaderPage(query) {
  return request({
    url: '/wms/electroform-header/page',
    method: 'get',
    params: query
  })
}

// 导出制版房领料单头 Excel
export function exportElectroformHeaderExcel(query) {
  return request({
    url: '/wms/electroform-header/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
