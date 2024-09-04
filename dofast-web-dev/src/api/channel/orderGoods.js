import request from '@/utils/request';

// 创建子订单
export function createOrderGoods(data) {
  return request({
    url: '/channel/order-goods/create',
    method: 'post',
    data: data,
  });
}

// 更新子订单
export function updateOrderGoods(data) {
  return request({
    url: '/channel/order-goods/update',
    method: 'put',
    data: data,
  });
}

// 删除子订单
export function deleteOrderGoods(id) {
  return request({
    url: '/channel/order-goods/delete?id=' + id,
    method: 'delete',
  });
}

// 获得子订单
export function getOrderGoods(id) {
  return request({
    url: '/channel/order-goods/get?id=' + id,
    method: 'get',
  });
}

// 获得子订单分页
export function getOrderGoodsPage(query) {
  return request({
    url: '/channel/order-goods/page',
    method: 'get',
    params: query,
  });
}

// 导出子订单 Excel
export function exportOrderGoodsExcel(query) {
  return request({
    url: '/channel/order-goods/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

// 获得子订单分页
export function getOrderGoodsListByOrderId(orderId) {
  return request({
    url: '/channel/order-goods/get-list',
    method: 'get',
    params: {
      ref_oid: orderId,
    },
  });
}
