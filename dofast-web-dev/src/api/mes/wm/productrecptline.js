import request from '@/utils/request';

// 查询产品入库记录行列表
export function listProductrecptline(query) {
  return request({
    url: '/mes/wms/product-recpt-line/page',
    method: 'get',
    params: query,
  });
}

// 查询产品入库记录行详细
export function getProductrecptline(lineId) {
  return request({
    url: '/mes/wms/product-recpt-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增产品入库记录行
export function addProductrecptline(data) {
  return request({
    url: '/mes/wms/product-recpt-line/create',
    method: 'post',
    data: data,
  });
}

// 修改产品入库记录行
export function updateProductrecptline(data) {
  return request({
    url: '/mes/wms/product-recpt-line/update',
    method: 'put',
    data: data,
  });
}

// 删除产品入库记录行
export function delProductrecptline(lineId) {
  return request({
    url: '/mes/wms/product-recpt-line/delete?id=' + lineId,
    method: 'delete',
  });
}
