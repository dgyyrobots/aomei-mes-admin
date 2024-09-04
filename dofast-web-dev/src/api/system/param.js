import request from '@/utils/request';

// 创建定制产品参数
export function createParam(data) {
  return request({
    url: '/system/param/create',
    method: 'post',
    data: data,
  });
}

// 更新定制产品参数
export function updateParam(data) {
  return request({
    url: '/system/param/update',
    method: 'put',
    data: data,
  });
}

// 删除定制产品参数
export function deleteParam(id) {
  return request({
    url: '/system/param/delete?id=' + id,
    method: 'delete',
  });
}

// 获得定制产品参数
export function getParam(id) {
  return request({
    url: '/system/param/get?id=' + id,
    method: 'get',
  });
}

// 获得定制产品参数分页
export function getParamPage(query) {
  return request({
    url: '/system/param/page',
    method: 'get',
    params: query,
  });
}

// 导出定制产品参数 Excel
export function exportParamExcel(query) {
  return request({
    url: '/system/param/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
