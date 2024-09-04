import request from '@/utils/request'

// 创建售后流程表单
export function createOrderAfter(data) {
  return request({
    url: '/bpm/sales/create',
    method: 'post',
    data: data
  })
}

// 更新售后流程表单
export function updateOrderAfter(data) {
  return request({
    url: '/bpm/sales/update',
    method: 'put',
    data: data
  })
}

// 删除售后流程表单
export function deleteOrderAfter(id) {
  return request({
    url: '/sales/order-after/delete?id=' + id,
    method: 'delete'
  })
}

// 获得售后流程表单
export function getOrderAfter(id) {
  return request({
    url: '/bpm/sales/get?id=' + id,
    method: 'get'
  })
}

// 获得售后流程表单分页
export function getOrderAfterPage(query) {
  return request({
    url: '/bpm/sales/page',
    method: 'get',
    params: query
  })
}

// 导出售后流程表单 Excel
export function exportOrderAfterExcel(query) {
  return request({
    url: '/sales/order-after/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
