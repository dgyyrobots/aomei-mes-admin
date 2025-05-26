import request from '@/utils/request'

// 创建异常等级配置
export function createExceptionLevelConfig(data) {
  return request({
    url: '/mes/exception-level-config/create',
    method: 'post',
    data: data
  })
}

// 更新异常等级配置
export function updateExceptionLevelConfig(data) {
  return request({
    url: '/mes/exception-level-config/update',
    method: 'put',
    data: data
  })
}

// 删除异常等级配置
export function deleteExceptionLevelConfig(id) {
  return request({
    url: '/mes/exception-level-config/delete?id=' + id,
    method: 'delete'
  })
}

// 获得异常等级配置
export function getExceptionLevelConfig(id) {
  return request({
    url: '/mes/exception-level-config/get?id=' + id,
    method: 'get'
  })
}

// 获得异常等级配置分页
export function getExceptionLevelConfigPage(query) {
  return request({
    url: '/mes/exception-level-config/page',
    method: 'get',
    params: query
  })
}

// 导出异常等级配置 Excel
export function exportExceptionLevelConfigExcel(query) {
  return request({
    url: '/mes/exception-level-config/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获得异常等级配置分页
export function getExceptionLevelConfigAllList(query) {
  return request({
    url: '/mes/exception-level-config/all-list',
    method: 'get',
    params: query
  })
}
