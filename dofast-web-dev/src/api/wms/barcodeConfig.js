import request from '@/utils/request'

// 创建条码配置
export function createBarcodeConfig(data) {
  return request({
    url: '/mes/wms/barcode-config/create',
    method: 'post',
    data: data
  })
}

// 更新条码配置
export function updateBarcodeConfig(data) {
  return request({
    url: '/mes/wms/barcode-config/update',
    method: 'put',
    data: data
  })
}

// 删除条码配置
export function deleteBarcodeConfig(id) {
  return request({
    url: '/mes/wms/barcode-config/delete?id=' + id,
    method: 'delete'
  })
}

// 获得条码配置
export function getBarcodeConfig(id) {
  return request({
    url: '/mes/wms/barcode-config/get?id=' + id,
    method: 'get'
  })
}

// 获得条码配置分页
export function getBarcodeConfigPage(query) {
  return request({
    url: '/mes/wms/barcode-config/page',
    method: 'get',
    params: query
  })
}

// 导出条码配置 Excel
export function exportBarcodeConfigExcel(query) {
  return request({
    url: '/mes/wms/barcode-config/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
