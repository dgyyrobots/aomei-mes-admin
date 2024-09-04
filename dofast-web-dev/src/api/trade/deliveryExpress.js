import request from '@/utils/request'

// 创建快递公司
export function createDeliveryExpress(data) {
  return request({
    url: '/trade/delivery/express/create',
    method: 'post',
    data: data
  })
}

// 更新快递公司
export function updateDeliveryExpress(data) {
  return request({
    url: '/trade/delivery/express/update',
    method: 'put',
    data: data
  })
}

// 删除快递公司
export function deleteDeliveryExpress(id) {
  return request({
    url: '/trade/delivery/express/delete?id=' + id,
    method: 'delete'
  })
}

// 获得快递公司
export function getDeliveryExpress(id) {
  return request({
    url: '/trade/delivery/express/get?id=' + id,
    method: 'get'
  })
}

// 获得快递公司分页
export function getDeliveryExpressPage(query) {
  return request({
    url: '/trade/delivery/express/page',
    method: 'get',
    params: query
  })
}

// 导出快递公司 Excel
export function exportDeliveryExpressExcel(query) {
  return request({
    url: '/trade/delivery/express/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
