import request from '@/utils/request';

// 创建采购入库单
export function createInvoice(data) {
  return request({
    url: '/purchase/invoice/create',
    method: 'post',
    data: data,
  });
}

// 更新采购入库单
export function updateInvoice(data) {
  return request({
    url: '/purchase/invoice/update',
    method: 'put',
    data: data,
  });
}

// 删除采购入库单
export function deleteInvoice(id) {
  return request({
    url: '/purchase/invoice/delete?id=' + id,
    method: 'delete',
  });
}

// 获得采购入库单
export function getInvoice(id) {
  return request({
    url: '/purchase/invoice/get?id=' + id,
    method: 'get',
  });
}

// 获得采购入库单分页
export function getInvoicePage(query) {
  return request({
    url: '/purchase/invoice/page',
    method: 'get',
    params: query,
  });
}

// 导出采购入库单 Excel
export function exportInvoiceExcel(query) {
  return request({
    url: '/purchase/invoice/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
