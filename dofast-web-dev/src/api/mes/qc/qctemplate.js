import request from '@/utils/request';

// 查询检测模板列表
export function listQctemplate(query) {
  return request({
    url: '/mes/qms/template/page',
    method: 'get',
    params: query,
  });
}

// 查询检测模板详细
export function getQctemplate(templateId) {
  return request({
    url: '/mes/qms/template/get?id=' + templateId,
    method: 'get',
  });
}

// 新增检测模板
export function addQctemplate(data) {
  return request({
    url: '/mes/qms/template/create',
    method: 'post',
    data: data,
  });
}

// 修改检测模板
export function updateQctemplate(data) {
  return request({
    url: '/mes/qms/template/update',
    method: 'put',
    data: data,
  });
}

// 删除检测模板
export function delQctemplate(templateId) {
  return request({
    url: '/mes/qms/template/delete?id=' + templateId,
    method: 'delete',
  });
}
