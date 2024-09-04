import request from '@/utils/request';

// 创建财务发票明细
export function createCashInvoiceDetail(data) {
  return request({
    url: '/finance/cash-invoice-detail/create',
    method: 'post',
    data: data,
  });
}

// 更新财务发票明细
export function updateCashInvoiceDetail(data) {
  return request({
    url: '/finance/cash-invoice-detail/update',
    method: 'put',
    data: data,
  });
}

// 删除财务发票明细
export function deleteCashInvoiceDetail(id) {
  return request({
    url: '/finance/cash-invoice-detail/delete?id=' + id,
    method: 'delete',
  });
}

// 获得财务发票明细
export function getCashInvoiceDetail(id) {
  return request({
    url: '/finance/cash-invoice-detail/get?id=' + id,
    method: 'get',
  });
}

// 获得财务发票明细分页
export function getCashInvoiceDetailPage(query) {
  return request({
    url: '/finance/cash-invoice-detail/page',
    method: 'get',
    params: query,
  });
}

// 导出财务发票明细 Excel
export function exportCashInvoiceDetailExcel(query) {
  return request({
    url: '/finance/cash-invoice-detail/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
