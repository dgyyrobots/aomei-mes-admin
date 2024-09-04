import request from '@/utils/request';

// 创建资金账号
export function createCashDepositor(data) {
  return request({
    url: '/finance/cash-depositor/create',
    method: 'post',
    data: data,
  });
}

// 更新资金账号
export function updateCashDepositor(data) {
  return request({
    url: '/finance/cash-depositor/update',
    method: 'put',
    data: data,
  });
}

// 删除资金账号
export function deleteCashDepositor(id) {
  return request({
    url: '/finance/cash-depositor/delete?id=' + id,
    method: 'delete',
  });
}

// 获得资金账号
export function getCashDepositor(id) {
  return request({
    url: '/finance/cash-depositor/get?id=' + id,
    method: 'get',
  });
}

// 获得资金账号分页
export function getCashDepositorPage(query) {
  return request({
    url: '/finance/cash-depositor/page',
    method: 'get',
    params: query,
  });
}

// 导出资金账号 Excel
export function exportCashDepositorExcel(query) {
  return request({
    url: '/finance/cash-depositor/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
