import request from '@/utils/request.js';

export function getOrderRemarkList({ trade_order_id, mixin_order_id }) {
  return request({
    url: trade_order_id ? '/channel/remark/get-list-trade-order' : '/channel/remark/get-list-sales-order',
    method: 'get',
    params: { id: trade_order_id || mixin_order_id },
  });
}

export function addOrderRemark(data) {
  return request({
    url: data.tradeOrderId ? '/channel/remark/create-trade' : '/channel/remark/create-mixin',
    method: 'post',
    data,
  });
}
export function gxOrderRemark(data) {
  return request({
    url: '/channel/remark/update',
    method: 'put',
    data,
  });
}

export function toggleTopRemark(id) {
  return request({
    url: '/channel/remark/toggle-top',
    method: 'get',
    params: { id },
  });
}
