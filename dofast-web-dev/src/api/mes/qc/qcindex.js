import request from '@/utils/request';

// 查询检测项列表
export function listQcindex(query) {
  return request({
    url: '/mes/qms/index/page',
    method: 'get',
    params: query,
  });
}

// 查询检测项详细
export function getQcindex(indexId) {
  return request({
    url: '/mes/qms/index/get?id=' + indexId,
    method: 'get',
  });
}

// 新增检测项
export function addQcindex(data) {
  return request({
    url: '/mes/qms/index/create',
    method: 'post',
    data: data,
  });
}

// 修改检测项
export function updateQcindex(data) {
  return request({
    url: '/mes/qms/index/update',
    method: 'put',
    data: data,
  });
}

// 删除检测项
export function delQcindex(indexId) {
  return request({
    url: '/mes/qms/index/delete?id' + indexId,
    method: 'delete',
  });
}
