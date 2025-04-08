import request from '@/utils/request'

// 创建ERP仓退单
export function createOrder(data) {
  return request({
    url: '/purchase/retreatOrder/create',
    method: 'post',
    data: data
  })
}

// 更新ERP仓退单
export function updateOrder(data) {
  return request({
    url: '/purchase/retreatOrder/update',
    method: 'put',
    data: data
  })
}

// 删除ERP仓退单
export function deleteOrder(id) {
  return request({
    url: '/purchase/retreatOrder/delete?id=' + id,
    method: 'delete'
  })
}

// 获得ERP仓退单
export function getOrder(id) {
  return request({
    url: '/purchase/retreatOrder/get?id=' + id,
    method: 'get'
  })
}

// 获得ERP仓退单分页
export function getOrderPage(query) {
  return request({
    url: '/purchase/retreatOrder/page',
    method: 'get',
    params: query
  })
}

// 导出ERP仓退单 Excel
export function exportOrderExcel(query) {
  return request({
    url: '/purchase/retreatOrder/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 调用ERP仓退接口
export function retreat(data) {
  return request({
    url: '/purchase/retreatOrder/retreat',
    method: 'post',
    data: data,
  });
}
