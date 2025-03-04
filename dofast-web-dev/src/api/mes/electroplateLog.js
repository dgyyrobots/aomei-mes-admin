import request from '@/utils/request'

// 创建制版房记录
export function createElectroplateLog(data) {
  return request({
    url: '/mes/electroplate-log/create',
    method: 'post',
    data: data
  })
}

// 更新制版房记录
export function updateElectroplateLog(data) {
  return request({
    url: '/mes/electroplate-log/update',
    method: 'put',
    data: data
  })
}

// 删除制版房记录
export function deleteElectroplateLog(id) {
  return request({
    url: '/mes/electroplate-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得制版房记录
export function getElectroplateLog(id) {
  return request({
    url: '/mes/electroplate-log/get?id=' + id,
    method: 'get'
  })
}

// 获得制版房记录分页
export function getElectroplateLogPage(query) {
  return request({
    url: '/mes/electroplate-log/page',
    method: 'get',
    params: query
  })
}

// 导出制版房记录 Excel
export function exportElectroplateLogExcel(query) {
  return request({
    url: '/mes/electroplate-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
