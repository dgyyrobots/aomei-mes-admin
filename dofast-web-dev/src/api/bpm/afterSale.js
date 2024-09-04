import request from '@/utils/request';

// 创建售后流程表单
export function createAfterSale(data) {
  return request({
    url: '/bpm/sales/create',
    method: 'post',
    data: data,
  });
}

// 更新售后流程表单
export function updateAfterSale(data) {
  return request({
    url: '/bpm/after-sale/update',
    method: 'put',
    data: data,
  });
}

// 删除售后流程表单
export function deleteAfterSale(id) {
  return request({
    url: '/bpm/after-sale/delete?id=' + id,
    method: 'delete',
  });
}

// 获得售后流程表单
export function getAfterSale(id) {
  return request({
    url: '/bpm/sales/get?id=' + id,
    method: 'get',
  });
}

// 获得售后流程表单分页
export function getAfterSalePage(query) {
  return request({
    url: '/bpm/sales/page',
    method: 'get',
    params: query,
  });
}

// 导出售后流程表单 Excel
export function exportAfterSaleExcel(query) {
  return request({
    url: '/bpm/after-sale/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
