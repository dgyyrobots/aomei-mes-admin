import request from '@/utils/request'

// 创建计时登记记录
export function createRegistrationLine(data) {
  return request({
    url: '/mes/registration-line/create',
    method: 'post',
    data: data
  })
}

// 更新计时登记记录
export function updateRegistrationLine(data) {
  return request({
    url: '/mes/registration-line/update',
    method: 'put',
    data: data
  })
}

// 删除计时登记记录
export function deleteRegistrationLine(id) {
  return request({
    url: '/mes/registration-line/delete?id=' + id,
    method: 'delete'
  })
}

// 获得计时登记记录
export function getRegistrationLine(id) {
  return request({
    url: '/mes/registration-line/get?id=' + id,
    method: 'get'
  })
}

// 获得计时登记记录分页
export function getRegistrationLinePage(query) {
  return request({
    url: '/mes/registration-line/page',
    method: 'get',
    params: query
  })
}


// 导出计时登记记录 Excel
export function exportRegistrationLineExcel(query) {
  return request({
    url: '/mes/registration-line/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
