import request from '@/utils/request';

// 查询产品SOP列表
export function listSop(query) {
  return request({
    url: '/mes/md-product-sop/page',
    method: 'get',
    params: query,
  });
}

// 查询产品SOP详细
export function getSop(sopId) {
  return request({
    url: '/mes/md-product-sop/get?id=' + sopId,
    method: 'get',
  });
}

// 新增产品SOP
export function addSop(data) {
  return request({
    url: '/mes/md-product-sop/create',
    method: 'post',
    data: data,
  });
}

// 修改产品SOP
export function updateSop(data) {
  return request({
    url: '/mes/md-product-sop/update',
    method: 'put',
    data: data,
  });
}

// 删除产品SOP
export function delSop(sopId) {
  return request({
    url: '/mes/md-product-sop/delete?id=' + sopId,
    method: 'delete',
  });
}
