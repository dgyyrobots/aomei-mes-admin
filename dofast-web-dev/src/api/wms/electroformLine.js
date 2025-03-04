import request from '@/utils/request'

// 创建制版房领料单身
export function createElectroformLine(data) {
  return request({
    url: '/wms/electroform-line/create',
    method: 'post',
    data: data
  })
}

// 更新制版房领料单身
export function updateElectroformLine(data) {
  return request({
    url: '/wms/electroform-line/update',
    method: 'put',
    data: data
  })
}

// 删除制版房领料单身
export function deleteElectroformLine(id) {
  return request({
    url: '/wms/electroform-line/delete?id=' + id,
    method: 'delete'
  })
}

// 获得制版房领料单身
export function getElectroformLine(id) {
  return request({
    url: '/wms/electroform-line/get?id=' + id,
    method: 'get'
  })
}

// 获得制版房领料单身分页
export function getElectroformLinePage(query) {
  return request({
    url: '/wms/electroform-line/page',
    method: 'get',
    params: query
  })
}

// 导出制版房领料单身体 Excel
export function exportElectroformLineExcel(query) {
  return request({
    url: '/wms/electroform-line/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
