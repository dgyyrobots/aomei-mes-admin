import request from '@/utils/request';

// 查询条码清单列表
export function listBarcode(query) {
  return request({
    url: '/mes/wms/barcode/page',
    method: 'get',
    params: query,
  });
}

// 查询条码清单详细
export function getBarcode(barcodeId) {
  return request({
    url: '/mes/wms/barcode/get?id=' + barcodeId,
    method: 'get',
  });
}

// 新增条码清单
export function addBarcode(data) {
  return request({
    url: '/mes/wms/barcode/create',
    method: 'post',
    data: data,
  });
}

// 修改条码清单
export function updateBarcode(data) {
  return request({
    url: '/mes/wms/barcode/update',
    method: 'put',
    data: data,
  });
}

// 删除条码清单
export function delBarcode(barcodeId) {
  return request({
    url: '/mes/wms/barcode/delete?id=' + barcodeId,
    method: 'delete',
  });
}
