import request from '@/utils/request';

// 查询客户列表
export function listClient(query) {
  return request({
    url: '/mes/md-client/page',
    method: 'get',
    params: query,
  });
}

// 查询客户详细
export function getClient(clientId) {
  return request({
    url: '/mes/md-client/get?id=' + clientId,
    method: 'get',
  });
}

// 新增客户
export function addClient(data) {
  return request({
    url: '/mes/md-client/create',
    method: 'post',
    data: data,
  });
}

// 修改客户
export function updateClient(data) {
  return request({
    url: '/mes/md-client/update',
    method: 'put',
    data: data,
  });
}

// 删除客户
export function delClient(clientId) {
  return request({
    url: '/mes/md-client/delete?id=' + clientId,
    method: 'delete',
  });
}
