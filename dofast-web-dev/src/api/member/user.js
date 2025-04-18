import request from '@/utils/request';

// 创建商城用户
export function createUser(data) {
  return request({
    url: '/member/user/create',
    method: 'post',
    data: data,
  });
}

// 更新商城用户
export function updateUser(data) {
  return request({
    url: '/member/user/update',
    method: 'put',
    data: data,
  });
}

// 删除商城用户
export function deleteUser(id) {
  return request({
    url: '/member/user/delete?id=' + id,
    method: 'delete',
  });
}

// 获得商城用户
export function getUser(id) {
  return request({
    url: '/member/user/get?id=' + id,
    method: 'get',
  });
}

// 获得商城用户分页
export function getUserPage(query) {
  return request({
    url: '/member/user/page',
    method: 'get',
    params: query,
  });
}

// 导出商城用户 Excel
export function exportUserExcel(query) {
  return request({
    url: '/member/user/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

// 获得商城用户分页
export function getMemberUserList(query) {
  return request({
    url: '/member/user/list-all',
    method: 'get',
    params: query,
  });
}
