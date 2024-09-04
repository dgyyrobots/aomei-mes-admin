import request from '@/utils/request';

// 查询产品制程列表
export function listRouteproduct(query) {
  return request({
    url: '/mes/pro/route-product/page',
    method: 'get',
    params: query,
  });
}

// 查询产品制程详细
export function getRouteproduct(recordId) {
  return request({
    url: '/mes/pro/route-product/get?id=' + recordId,
    method: 'get',
  });
}

// 新增产品制程
export function addRouteproduct(data) {
  return request({
    url: '/mes/pro/route-product/create',
    method: 'post',
    data: data,
  });
}

// 修改产品制程
export function updateRouteproduct(data) {
  return request({
    url: '/mes/pro/route-product/update',
    method: 'put',
    data: data,
  });
}

// 修改产品制程
export function moveRouteproduct(data) {
  return request({
    url: '/mes/pro/route-product/move',
    method: 'put',
    data: data,
  });
}

// 删除产品制程
export function delRouteproduct(recordId) {
  return request({
    url: '/mes/pro/route-product/delete?id=' + recordId,
    method: 'delete',
  });
}
