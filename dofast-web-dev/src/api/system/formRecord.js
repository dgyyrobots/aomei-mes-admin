import request from '@/utils/request';

// 创建表单历史
export function createFormRecord(data) {
  return request({
    url: '/system/form-record/create',
    method: 'post',
    data: data,
  });
}

// 更新表单历史
export function updateFormRecord(data) {
  return request({
    url: '/system/form-record/update',
    method: 'put',
    data: data,
  });
}

// 删除表单历史
export function deleteFormRecord(id) {
  return request({
    url: '/system/form-record/delete?id=' + id,
    method: 'delete',
  });
}

// 获得表单历史
export function getFormRecord(id) {
  return request({
    url: '/system/form-record/get?id=' + id,
    method: 'get',
  });
}

// 获得表单历史
export function getFormRecordList(ids) {
  if (!ids || ids.length < 1) {
    return Promise.resolve({ data: [] });
  }
  return request({
    url: '/system/form-record/list?ids=' + ids.join(','),
    method: 'get',
  });
}

// 获得表单历史分页
export function getFormRecordPage(query) {
  return request({
    url: '/system/form-record/page',
    method: 'get',
    params: query,
  });
}

// 导出表单历史 Excel
export function exportFormRecordExcel(query) {
  return request({
    url: '/system/form-record/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
