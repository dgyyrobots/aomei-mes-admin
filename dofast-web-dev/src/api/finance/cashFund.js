import request from '@/utils/request';

// 创建财务退款
export function createCashFund(data) {
  return request({
    url: '/finance/cash-fund/create',
    method: 'post',
    data: data,
  });
}

// 更新财务退款
export function updateCashFund(data) {
  return request({
    url: '/finance/cash-fund/update',
    method: 'put',
    data: data,
  });
}

// 删除财务退款
export function deleteCashFund(id) {
  return request({
    url: '/finance/cash-fund/delete?id=' + id,
    method: 'delete',
  });
}

// 获得财务退款
export function getCashFund(id) {
  return request({
    url: '/finance/cash-fund/get?id=' + id,
    method: 'get',
  });
}

// 获得财务退款分页
export function getCashFundPage(query) {
  return request({
    url: '/finance/cash-fund/page',
    method: 'get',
    params: query,
  });
}

// 导出财务退款 Excel
export function exportCashFundExcel(query) {
  return request({
    url: '/finance/cash-fund/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
