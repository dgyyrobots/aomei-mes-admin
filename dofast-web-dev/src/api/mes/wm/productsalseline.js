import request from '@/utils/request';

// 查询产品销售出库行列表
export function listProductsalseline(query) {
  return request({
    url: '/mes/wms/product-salse-line/page',
    method: 'get',
    params: query,
  });
}

// 查询产品销售出库行详细
export function getProductsalseline(lineId) {
  return request({
    url: '/mes/wms/product-salse-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增产品销售出库行
export function addProductsalseline(data) {
  return request({
    url: '/mes/wms/product-salse-line/create',
    method: 'post',
    data: data,
  });
}

// 修改产品销售出库行
export function updateProductsalseline(data) {
  return request({
    url: '/mes/wms/product-salse-line/update',
    method: 'put',
    data: data,
  });
}

// 删除产品销售出库行
export function delProductsalseline(lineId) {
  return request({
    url: '/mes/wms/product-salse-line/delete?id=' + lineId,
    method: 'delete',
  });
}
