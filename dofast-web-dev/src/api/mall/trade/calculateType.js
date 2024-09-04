import request from '@/utils/request';

// 创建计价类型
export function createCalculateType(data) {
  return request({
    url: '/trade/calculate-type/create',
    method: 'post',
    data: data,
  });
}

// 更新计价类型
export function updateCalculateType(data) {
  return request({
    url: '/trade/calculate-type/update',
    method: 'put',
    data: data,
  });
}

// 删除计价类型
export function deleteCalculateType(id) {
  return request({
    url: '/trade/calculate-type/delete?id=' + id,
    method: 'delete',
  });
}

// 获得计价类型
export function getCalculateType(id) {
  return request({
    url: '/trade/calculate-type/get?id=' + id,
    method: 'get',
  });
}

// 获得计价类型分页
export function getCalculateTypePage(query) {
  return request({
    url: '/trade/calculate-type/page',
    method: 'get',
    params: query,
  });
}

// 导出计价类型 Excel
export function exportCalculateTypeExcel(query) {
  return request({
    url: '/trade/calculate-type/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
