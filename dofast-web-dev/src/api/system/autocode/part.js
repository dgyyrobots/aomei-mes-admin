import request from '@/utils/request';

// 查询规则组成
export function listPart(query) {
  return request({
    url: '/mes/auto-code-part/page',
    method: 'get',
    params: query,
  });
}

// 查询规则组成详细
export function getPart(partId) {
  return request({
    url: '/mes/auto-code-part/get?id=' + partId,
    method: 'get',
  });
}

// 新增规则组成
export function addPart(data) {
  return request({
    url: '/mes/auto-code-part/create',
    method: 'post',
    data: data,
  });
}

// 修改规则组成
export function updatePart(data) {
  return request({
    url: '/mes/auto-code-part/update',
    method: 'put',
    data: data,
  });
}

// 删除规则组成
export function delPart(partIds) {
  return request({
    url: '/mes/auto-code-part/delete?id=' + partId,
    method: 'delete',
  });
}
