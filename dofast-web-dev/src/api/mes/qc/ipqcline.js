import request from '@/utils/request';

// 查询过程检验单行列表
export function listIpqcline(query) {
  return request({
    url: '/mes/qms/ipqc-line/page',
    method: 'get',
    params: query,
  });
}

// 查询过程检验单行详细
export function getIpqcline(lineId) {
  return request({
    url: '/mes/qms/ipqc-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增过程检验单行
export function addIpqcline(data) {
  return request({
    url: '/mes/qms/ipqc-line/create',
    method: 'post',
    data: data,
  });
}

// 修改过程检验单行
export function updateIpqcline(data) {
  return request({
    url: '/mes/qms/ipqc-line/update',
    method: 'put',
    data: data,
  });
}

// 删除过程检验单行
export function delIpqcline(lineId) {
  return request({
    url: '/mes/qms/ipqc-line/delete?id=' + lineId,
    method: 'delete',
  });
}
