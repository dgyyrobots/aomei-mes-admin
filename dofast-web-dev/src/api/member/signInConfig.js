import request from '@/utils/request'

// 创建签到配置
export function createSignInConfig(data) {
  return request({
    url: '/member/sign-in/config/create',
    method: 'post',
    data: data
  })
}

// 更新签到配置
export function updateSignInConfig(data) {
  return request({
    url: '/member/sign-in/config/update',
    method: 'put',
    data: data
  })
}

// 删除签到配置
export function deleteSignInConfig(id) {
  return request({
    url: '/member/sign-in/config/delete?id=' + id,
    method: 'delete'
  })
}

// 获得签到配置
export function getSignInConfig(id) {
  return request({
    url: '/member/sign-in/config/get?id=' + id,
    method: 'get'
  })
}

// 获得签到配置分页
export function getSignInConfigPage(query) {
  return request({
    url: '/member/sign-in/config/list',
    method: 'get',
    params: query
  })
}

// 导出签到配置 Excel
export function exportSignInConfigExcel(query) {
  return request({
    url: '/member/sign-in/config/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
