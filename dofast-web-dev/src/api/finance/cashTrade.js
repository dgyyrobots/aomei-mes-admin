import request from '@/utils/request';

// 创建财务流水
export function createCashTrade(data) {
  return request({
    url: '/finance/cash-trade/create',
    method: 'post',
    data: data,
  });
}

// 更新财务流水
export function updateCashTrade(data) {
  return request({
    url: '/finance/cash-trade/update',
    method: 'put',
    data: data,
  });
}

// 删除财务流水
export function deleteCashTrade(id) {
  return request({
    url: '/finance/cash-trade/delete?id=' + id,
    method: 'delete',
  });
}

// 获得财务流水
export function getCashTrade(id) {
  return request({
    url: '/finance/cash-trade/get?id=' + id,
    method: 'get',
  });
}

// 获得财务流水分页
export function getCashTradePage(query) {
  return request({
    url: '/finance/cash-trade/page',
    method: 'get',
    params: query,
  });
}

// 导出财务流水 Excel
export function exportCashTradeExcel(query) {
  return request({
    url: '/finance/cash-trade/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
