import request from '@/utils/request';

// 查询常见缺陷列表
export function listQcdefect(query) {
  return request({
    url: '/mes/qms/defect/page',
    method: 'get',
    params: query,
  });
}

// 查询常见缺陷详细
export function getQcdefect(defectId) {
  return request({
    url: '/mes/qms/defect/get?id=' + defectId,
    method: 'get',
  });
}

// 新增常见缺陷
export function addQcdefect(data) {
  return request({
    url: '/mes/qms/defect/create',
    method: 'post',
    data: data,
  });
}

// 修改常见缺陷
export function updateQcdefect(data) {
  return request({
    url: '/mes/qms/defect/update',
    method: 'put',
    data: data,
  });
}

// 删除常见缺陷
export function delQcdefect(defectId) {
  return request({
    url: '/mes/qms/defect/delete?id=' + defectId,
    method: 'delete',
  });
}
