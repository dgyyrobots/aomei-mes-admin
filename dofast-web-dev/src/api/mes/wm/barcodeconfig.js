import request from '@/utils/request';

// 查询条码配置列表
export function listBarcodeconfig(query) {
  return request({
    url: '/mes/wms/barcode-config/page',
    method: 'get',
    params: query,
  });
}

// 查询条码配置详细
export function getBarcodeconfig(configId) {
  return request({
    url: '/mes/wms/barcode-config/get?id=' + configId,
    method: 'get',
  });
}

// 新增条码配置
export function addBarcodeconfig(data) {
  return request({
    url: '/mes/wms/barcode-config/create',
    method: 'post',
    data: data,
  });
}

// 修改条码配置
export function updateBarcodeconfig(data) {
  return request({
    url: '/mes/wms/barcode-config/update',
    method: 'put',
    data: data,
  });
}

// 删除条码配置
export function delBarcodeconfig(configId) {
  return request({
    url: '/mes/wms/barcode-config/delete?id=' + configId,
    method: 'delete',
  });
}
