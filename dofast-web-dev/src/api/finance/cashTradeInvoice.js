import request from '@/utils/request';

// 创建业务发票关联
export function createCashTradeInvoice(data) {
  return request({
    url: '/finance/cash-trade-invoice/create',
    method: 'post',
    data: data,
  });
}

// 更新业务发票关联
export function updateCashTradeInvoice(data) {
  return request({
    url: '/finance/cash-trade-invoice/update',
    method: 'put',
    data: data,
  });
}

// 删除业务发票关联
export function deleteCashTradeInvoice(id) {
  return request({
    url: '/finance/cash-trade-invoice/delete?id=' + id,
    method: 'delete',
  });
}

// 获得业务发票关联
export function getCashTradeInvoice(id) {
  return request({
    url: '/finance/cash-trade-invoice/get?id=' + id,
    method: 'get',
  });
}

// 获得业务发票关联分页
export function getCashTradeInvoicePage(query) {
  return request({
    url: '/finance/cash-trade-invoice/page',
    method: 'get',
    params: query,
  });
}

// 导出业务发票关联 Excel
export function exportCashTradeInvoiceExcel(query) {
  return request({
    url: '/finance/cash-trade-invoice/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
