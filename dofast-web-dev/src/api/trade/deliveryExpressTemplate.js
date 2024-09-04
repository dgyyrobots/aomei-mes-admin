import request from '@/utils/request'

// 创建快递运费模板
export function createDeliveryExpressTemplate(data) {
  return request({
    url: '/trade/delivery/express-template/create',
    method: 'post',
    data: data
  })
}

// 更新快递运费模板
export function updateDeliveryExpressTemplate(data) {
  return request({
    url: '/trade/delivery/express-template/update',
    method: 'put',
    data: data
  })
}

// 删除快递运费模板
export function deleteDeliveryExpressTemplate(id) {
  return request({
    url: '/trade/delivery/express-template/delete?id=' + id,
    method: 'delete'
  })
}

// 获得快递运费模板
export function getDeliveryExpressTemplate(id) {
  return request({
    url: '/trade/delivery/express-template/get?id=' + id,
    method: 'get'
  })
}

// 获得快递运费模板分页
export function getDeliveryExpressTemplatePage(query) {
  return request({
    url: '/trade/delivery/express-template/page',
    method: 'get',
    params: query
  })
}

// 导出快递运费模板 Excel
export function exportDeliveryExpressTemplateExcel(query) {
  return request({
    url: '/trade/delivery/express-template/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
