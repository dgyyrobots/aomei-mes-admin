import request from '@/utils/request';

// 创建发票信息
export function createCashInvoice(data) {
  return request({
    url: '/finance/cash-invoice/create',
    method: 'post',
    data: data,
  });
}

// 更新发票信息
export function updateCashInvoice(data) {
  return request({
    url: '/finance/cash-invoice/update',
    method: 'put',
    data: data,
  });
}

// 删除发票信息
export function deleteCashInvoice(id) {
  return request({
    url: '/finance/cash-invoice/delete?id=' + id,
    method: 'delete',
  });
}

// 获得发票信息
export function getCashInvoice(id) {
  return request({
    url: '/finance/cash-invoice/get?id=' + id,
    method: 'get',
  });
}

// 获得发票信息分页
export function getCashInvoicePage(query) {
  return request({
    url: '/finance/cash-invoice/page',
    method: 'get',
    params: query,
  });
}

// 导出发票信息 Excel
export function exportCashInvoiceExcel(query) {
  return request({
    url: '/finance/cash-invoice/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
