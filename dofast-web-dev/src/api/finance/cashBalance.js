import request from '@/utils/request';

// 创建现金余额
export function createCashBalance(data) {
  return request({
    url: '/finance/cash-balance/create',
    method: 'post',
    data: data,
  });
}

// 更新现金余额
export function updateCashBalance(data) {
  return request({
    url: '/finance/cash-balance/update',
    method: 'put',
    data: data,
  });
}

// 删除现金余额
export function deleteCashBalance(id) {
  return request({
    url: '/finance/cash-balance/delete?id=' + id,
    method: 'delete',
  });
}

// 获得现金余额
export function getCashBalance(id) {
  return request({
    url: '/finance/cash-balance/get?id=' + id,
    method: 'get',
  });
}

// 获得现金余额分页
export function getCashBalancePage(query) {
  return request({
    url: '/finance/cash-balance/page',
    method: 'get',
    params: query,
  });
}

// 导出现金余额 Excel
export function exportCashBalanceExcel(query) {
  return request({
    url: '/finance/cash-balance/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
