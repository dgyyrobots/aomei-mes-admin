import request from '@/utils/request';

// 查询检测模板-产品列表
export function listTemplateproduct(query) {
  return request({
    url: '/mes/qms/template-product/page',
    method: 'get',
    params: query,
  });
}

// 查询检测模板-产品详细
export function getTemplateproduct(recordId) {
  return request({
    url: '/mes/qms/template-product/get?id=' + recordId,
    method: 'get',
  });
}

// 新增检测模板-产品
export function addTemplateproduct(data) {
  return request({
    url: '/mes/qms/template-product/create',
    method: 'post',
    data: data,
  });
}

// 修改检测模板-产品
export function updateTemplateproduct(data) {
  return request({
    url: '/mes/qms/template-product/update',
    method: 'put',
    data: data,
  });
}

// 删除检测模板-产品
export function delTemplateproduct(recordId) {
  return request({
    url: '/mes/qms/template-product/delete?id=' + recordId,
    method: 'delete',
  });
}
