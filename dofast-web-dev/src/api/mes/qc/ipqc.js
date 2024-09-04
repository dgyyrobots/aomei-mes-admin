import request from '@/utils/request';

// 查询过程检验单列表
export function listIpqc(query) {
  return request({
    url: '/mes/qms/ipqc/page',
    method: 'get',
    params: query,
  });
}

// 查询过程检验单详细
export function getIpqc(ipqcId) {
  return request({
    url: '/mes/qms/ipqc/get?id=' + ipqcId,
    method: 'get',
  });
}

// 新增过程检验单
export function addIpqc(data) {
  return request({
    url: '/mes/qms/ipqc/create',
    method: 'post',
    data: data,
  });
}

// 修改过程检验单
export function updateIpqc(data) {
  return request({
    url: '/mes/qms/ipqc/update',
    method: 'put',
    data: data,
  });
}

// 删除过程检验单
export function delIpqc(ipqcId) {
  return request({
    url: '/mes/qms/ipqc/delete?id=' + ipqcId,
    method: 'delete',
  });
}
