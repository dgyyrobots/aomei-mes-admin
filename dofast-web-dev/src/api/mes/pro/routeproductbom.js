import request from '@/utils/request';

// 查询产品制程物料BOM列表
export function listRouteproductbom(query) {
  return request({
    url: '/mes/pro/route-product-bom/page',
    method: 'get',
    params: query,
  });
}

// 查询产品制程物料BOM详细
export function getRouteproductbom(recordId) {
  return request({
    url: '/mes/pro/route-product-bom/get?id=' + recordId,
    method: 'get',
  });
}

// 新增产品制程物料BOM
export function addRouteproductbom(data) {
  return request({
    url: '/mes/pro/route-product-bom/create',
    method: 'post',
    data: data,
  });
}

// 修改产品制程物料BOM
export function updateRouteproductbom(data) {
  return request({
    url: '/mes/pro/route-product-bom/update',
    method: 'put',
    data: data,
  });
}

// 删除产品制程物料BOM
export function delRouteproductbom(recordId) {
  return request({
    url: '/mes/pro/route-product-bom/delete?id=' + recordId,
    method: 'delete',
  });
}
