import request from '@/utils/request';

// 创建定制产品参数记录
export function createParamData(data) {
  return request({
    url: '/system/param-data/create',
    method: 'post',
    data: data,
  });
}

// 更新定制产品参数记录
export function updateParamData(data) {
  return request({
    url: '/system/param-data/update',
    method: 'put',
    data: data,
  });
}

// 删除定制产品参数记录
export function deleteParamData(id) {
  return request({
    url: '/system/param-data/delete?id=' + id,
    method: 'delete',
  });
}

// 获得定制产品参数记录
export function getParamData(id) {
  return request({
    url: '/system/param-data/get?id=' + id,
    method: 'get',
  });
}

// 获得定制产品参数记录分页
export function getParamDataPage(query) {
  return request({
    url: '/system/param-data/page',
    method: 'get',
    params: query,
  });
}

// 导出定制产品参数记录 Excel
export function exportParamDataExcel(query) {
  return request({
    url: '/system/param-data/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
