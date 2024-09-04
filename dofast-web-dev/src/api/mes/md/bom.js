import request from '@/utils/request';

// 查询产品BOM关系列表
export function listBom(query) {
  return request({
    url: '/mes/md-product-bom/page',
    method: 'get',
    params: query,
  });
}

// 查询产品BOM关系详细
export function getBom(bomId) {
  return request({
    url: '/mes/md-product-bom/get?id=' + bomId,
    method: 'get',
  });
}

// 新增产品BOM关系
export function addBom(data) {
  return request({
    url: '/mes/md-product-bom/create',
    method: 'post',
    data: data,
  });
}

// 修改产品BOM关系
export function updateBom(data) {
  return request({
    url: '/mes/md-product-bom/update',
    method: 'put',
    data: data,
  });
}

// 删除产品BOM关系
export function delBom(bomId) {
  return request({
    url: '/mes/md-product-bom/delete?id=' + bomId,
    method: 'delete',
  });
}
