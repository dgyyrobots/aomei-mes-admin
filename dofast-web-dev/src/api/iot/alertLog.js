import request from '@/utils/request'

// 创建设备告警日志
export function createAlertLog(data) {
  return request({
    url: '/iot/alert-log/create',
    method: 'post',
    data: data
  })
}

// 更新设备告警日志
export function updateAlertLog(data) {
  return request({
    url: '/iot/alert-log/update',
    method: 'put',
    data: data
  })
}

// 删除设备告警日志
export function deleteAlertLog(id) {
  return request({
    url: '/iot/alert-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得设备告警日志
export function getAlertLog(id) {
  return request({
    url: '/iot/alert-log/get?id=' + id,
    method: 'get'
  })
}

// 获得设备告警日志分页
export function getAlertLogPage(query) {
  return request({
    url: '/iot/alert-log/page',
    method: 'get',
    params: query
  })
}

// 导出设备告警日志 Excel
export function exportAlertLogExcel(query) {
  return request({
    url: '/iot/alert-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
