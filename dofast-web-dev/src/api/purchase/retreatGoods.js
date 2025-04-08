import request from '@/utils/request'

// 创建ERP仓退单单身
export function createGoods(data) {
  return request({
    url: '/purchase/retreatGoods/create',
    method: 'post',
    data: data
  })
}

// 更新ERP仓退单单身
export function updateGoods(data) {
  return request({
    url: '/purchase/retreatGoods/update',
    method: 'put',
    data: data
  })
}

// 删除ERP仓退单单身
export function deleteGoods(id) {
  return request({
    url: '/purchase/retreatGoods/delete?id=' + id,
    method: 'delete'
  })
}

// 获得ERP仓退单单身
export function getGoods(id) {
  return request({
    url: '/purchase/retreatGoods/get?id=' + id,
    method: 'get'
  })
}

// 获得ERP仓退单单身分页
export function getGoodsPage(query) {
  return request({
    url: '/purchase/retreatGoods/page',
    method: 'get',
    params: query
  })
}

// 导出ERP仓退单单身 Excel
export function exportGoodsExcel(query) {
  return request({
    url: '/purchase/retreatGoods/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
