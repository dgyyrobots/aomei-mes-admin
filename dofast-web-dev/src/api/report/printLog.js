import request from '@/utils/request'

// 创建打印日志
export function createPrintLog(data) {
  return request({
    url: '/report/print-log/create',
    method: 'post',
    data: data
  })
}

// 更新打印日志
export function updatePrintLog(data) {
  return request({
    url: '/report/print-log/update',
    method: 'put',
    data: data
  })
}

// 删除打印日志
export function deletePrintLog(id) {
  return request({
    url: '/report/print-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得打印日志
export function getPrintLog(id) {
  return request({
    url: '/report/print-log/get?id=' + id,
    method: 'get'
  })
}

// 获得打印日志分页
export function getPrintLogPage(query) {
  return request({
    url: '/report/print-log/page',
    method: 'get',
    params: query
  })
}

// 导出打印日志 Excel
export function exportPrintLogExcel(query) {
  return request({
    url: '/report/print-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
