import request from '@/utils/request';

// 创建字段
export function createFormItem(data) {
  return request({
    url: '/system/form-item/create',
    method: 'post',
    data: data,
  });
}

// 更新字段
export function updateFormItem(data) {
  return request({
    url: '/system/form-item/update',
    method: 'put',
    data: data,
  });
}

// 删除字段
export function deleteFormItem(id) {
  return request({
    url: '/system/form-item/delete?id=' + id,
    method: 'delete',
  });
}

// 获得字段
export function getFormItem(id) {
  return request({
    url: '/system/form-item/get?id=' + id,
    method: 'get',
  });
}

// 获得字段分页
export function getFormItemPage(query) {
  return request({
    url: '/system/form-item/page',
    method: 'get',
    params: query,
  });
}

// 获得字段列表
export function getFormItemList(query) {
  return request({
    url: '/system/form-item/list',
    method: 'get',
    params: query,
  });
}

// 导出字段 Excel
export function exportFormItemExcel(query) {
  return request({
    url: '/system/form-item/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
