import request from '@/utils/request';

// 查询产品产出记录行列表
export function listProductproduceline(query) {
  return request({
    url: '/mes/wm/productproduceline/page',
    method: 'get',
    params: query,
  });
}

// 查询产品产出记录行详细
export function getProductproduceline(lineId) {
  return request({
    url: '/mes/wm/productproduceline/get?id=' + lineId,
    method: 'get',
  });
}

// 新增产品产出记录行
export function addProductproduceline(data) {
  return request({
    url: '/mes/wm/productproduceline/create',
    method: 'post',
    data: data,
  });
}

// 修改产品产出记录行
export function updateProductproduceline(data) {
  return request({
    url: '/mes/wm/productproduceline/update',
    method: 'put',
    data: data,
  });
}

// 删除产品产出记录行
export function delProductproduceline(lineId) {
  return request({
    url: '/mes/wm/productproduceline/delete?id=' + lineId,
    method: 'delete',
  });
}
