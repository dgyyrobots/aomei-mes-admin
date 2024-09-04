import request from '@/utils/request'

// 创建电子面单
export function createExpressElectronicsheet(data) {
  return request({
    url: '/deliver/express-electronicsheet/create',
    method: 'post',
    data: data
  })
}

// 更新电子面单
export function updateExpressElectronicsheet(data) {
  return request({
    url: '/deliver/express-electronicsheet/update',
    method: 'put',
    data: data
  })
}

// 删除电子面单
export function deleteExpressElectronicsheet(id) {
  return request({
    url: '/deliver/express-electronicsheet/delete?id=' + id,
    method: 'delete'
  })
}

// 获得电子面单
export function getExpressElectronicsheet(id) {
  return request({
    url: '/deliver/express-electronicsheet/get?id=' + id,
    method: 'get'
  })
}

// 获得电子面单分页
export function getExpressElectronicsheetPage(query) {
  return request({
    url: '/deliver/express-electronicsheet/page',
    method: 'get',
    params: query
  })
}

// 导出电子面单 Excel
export function exportExpressElectronicsheetExcel(query) {
  return request({
    url: '/deliver/express-electronicsheet/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
