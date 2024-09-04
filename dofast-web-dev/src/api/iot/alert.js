import request from '@/utils/request'

// 创建设备告警
export function createAlert(data) {
  return request({
    url: '/iot/alert/create',
    method: 'post',
    data: data
  })
}

// 更新设备告警
export function updateAlert(data) {
  return request({
    url: '/iot/alert/update',
    method: 'put',
    data: data
  })
}

// 删除设备告警
export function deleteAlert(id) {
  return request({
    url: '/iot/alert/delete?id=' + id,
    method: 'delete'
  })
}

// 获得设备告警
export function getAlert(id) {
  return request({
    url: '/iot/alert/get?id=' + id,
    method: 'get'
  })
}

// 获得设备告警分页
export function getAlertPage(query) {
  return request({
    url: '/iot/alert/page',
    method: 'get',
    params: query
  })
}

// 导出设备告警 Excel
export function exportAlertExcel(query) {
  return request({
    url: '/iot/alert/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
