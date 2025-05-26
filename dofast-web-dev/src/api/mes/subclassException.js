import request from '@/utils/request'

// 创建子类异常项配置
export function createSubclassException(data) {
  return request({
    url: '/mes/subclass-exception/create',
    method: 'post',
    data: data
  })
}

// 更新子类异常项配置
export function updateSubclassException(data) {
  return request({
    url: '/mes/subclass-exception/update',
    method: 'put',
    data: data
  })
}

// 删除子类异常项配置
export function deleteSubclassException(id) {
  return request({
    url: '/mes/subclass-exception/delete?id=' + id,
    method: 'delete'
  })
}

// 获得子类异常项配置
export function getSubclassException(id) {
  return request({
    url: '/mes/subclass-exception/get?id=' + id,
    method: 'get'
  })
}

// 获得子类异常项配置分页
export function getSubclassExceptionPage(query) {
  return request({
    url: '/mes/subclass-exception/page',
    method: 'get',
    params: query
  })
}

// 获得子类异常项配置分页
export function getSubclassExceptionAllList(query) {
  return request({
    url: '/mes/subclass-exception/all-list',
    method: 'get',
    params: query
  })
}


// 导出子类异常项配置 Excel
export function exportSubclassExceptionExcel(query) {
  return request({
    url: '/mes/subclass-exception/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
