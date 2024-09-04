import request from '@/utils/request';

// 创建采购退货
export function createRefund(data) {
  return request({
    url: '/purchase/refund/create',
    method: 'post',
    data: data,
  });
}

// 更新采购退货
export function updateRefund(data) {
  return request({
    url: '/purchase/refund/update',
    method: 'put',
    data: data,
  });
}

// 删除采购退货
export function deleteRefund(id) {
  return request({
    url: '/purchase/refund/delete?id=' + id,
    method: 'delete',
  });
}

// 获得采购退货
export function getRefund(id) {
  return request({
    url: '/purchase/refund/get?id=' + id,
    method: 'get',
  });
}

// 获得采购退货分页
export function getRefundPage(query) {
  return request({
    url: '/purchase/refund/page',
    method: 'get',
    params: query,
  });
}

// 导出采购退货 Excel
export function exportRefundExcel(query) {
  return request({
    url: '/purchase/refund/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
