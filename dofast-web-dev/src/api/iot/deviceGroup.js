import request from '@/utils/request'

// 创建设备分组
export function createDeviceGroup(data) {
  return request({
    url: '/iot/device-group/create',
    method: 'post',
    data: data
  })
}

// 更新设备分组
export function updateDeviceGroup(data) {
  return request({
    url: '/iot/device-group/update',
    method: 'put',
    data: data
  })
}

// 删除设备分组
export function deleteDeviceGroup(id) {
  return request({
    url: '/iot/device-group/delete?id=' + id,
    method: 'delete'
  })
}

// 获得设备分组
export function getDeviceGroup(id) {
  return request({
    url: '/iot/device-group/get?id=' + id,
    method: 'get'
  })
}

// 获得设备分组分页
export function getDeviceGroupPage(query) {
  return request({
    url: '/iot/device-group/page',
    method: 'get',
    params: query
  })
}

// 导出设备分组 Excel
export function exportDeviceGroupExcel(query) {
  return request({
    url: '/iot/device-group/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
