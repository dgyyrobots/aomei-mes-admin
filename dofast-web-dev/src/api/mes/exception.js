import request from '@/utils/request'

// 创建异常登记
export function createException(data) {
  return request({
    url: '/mes/exception/create',
    method: 'post',
    data: data
  })
}

// 更新异常登记
export function updateException(data) {
  return request({
    url: '/mes/exception/update',
    method: 'put',
    data: data
  })
}

// 删除异常登记
export function deleteException(id) {
  return request({
    url: '/mes/exception/delete?id=' + id,
    method: 'delete'
  })
}

// 获得异常登记
export function getException(id) {
  return request({
    url: '/mes/exception/get?id=' + id,
    method: 'get'
  })
}

// 获得异常登记分页
export function getExceptionPage(query) {
  return request({
    url: '/mes/exception/page',
    method: 'get',
    params: query
  })
}

// 导出异常登记 Excel
export function exportExceptionExcel(query) {
  return request({
    url: '/mes/exception/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
