import request from '@/utils/request'

// 创建计时登记
export function createRegistration(data) {
  return request({
    url: '/mes/registration/create',
    method: 'post',
    data: data
  })
}

// 更新计时登记
export function updateRegistration(data) {
  return request({
    url: '/mes/registration/update',
    method: 'put',
    data: data
  })
}

// 删除计时登记
export function deleteRegistration(id) {
  return request({
    url: '/mes/registration/delete?id=' + id,
    method: 'delete'
  })
}

// 获得计时登记
export function getRegistration(id) {
  return request({
    url: '/mes/registration/get?id=' + id,
    method: 'get'
  })
}

// 获得计时登记分页
export function getRegistrationPage(query) {
  return request({
    url: '/mes/registration/page',
    method: 'get',
    params: query
  })
}

// 导出计时登记 Excel
export function exportRegistrationExcel(query) {
  return request({
    url: '/mes/registration/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}



// 获得计时登记
export function finshRegistration(id) {
  return request({
    url: '/mes/registration/finshRegistration',
    method: 'put',
    data: {
      id: id
    }
  })
}
