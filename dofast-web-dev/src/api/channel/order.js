import request from '@/utils/request';
import graphql from '@/utils/graphql';

// 创建主订单
export function createOrder(data) {
  return request({
    url: '/channel/order/create',
    method: 'post',
    data: data,
  });
}

// 更新主订单
export function updateOrder(data) {
  return request({
    url: '/channel/order/update',
    method: 'put',
    data: data,
  });
}

// 删除主订单
export function deleteOrder(id) {
  return request({
    url: '/channel/order/delete?id=' + id,
    method: 'delete',
  });
}

// 获得主订单
export function getOrder(id) {
  return request({
    url: '/channel/order/get?id=' + id,
    method: 'get',
  });
}

// 获得主订单分页
export function getOrderPage(query) {
  return request({
    url: '/channel/order/page',
    method: 'post',
    data: query,
  });
}

// 导出主订单 Excel
export function exportOrderExcel(query) {
  return request({
    url: '/channel/order/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

export function getTotal() {
  return request({
    url: '/channel/order/total',
    method: 'get',
    params: {},
  });
}

export function getShopTotal(shopId) {
  return request({
    url: '/channel/order/shop-total',
    method: 'get',
    params: shopId ? { shopId } : {},
  });
}

export function getShopDayTotal(shopId) {
  return request({
    url: '/channel/order/shop-day-total',
    method: 'get',
    params: { shopId },
  });
}

export function toTrade(data) {
  return request({
    url: '/channel/order/to-inner-shop',
    method: 'post',
    data,
  });
}

export function setOrderAddress(order_id, data) {
  return request({
    url: '/trade/order/set-address?id=' + order_id,
    method: 'post',
    data,
  });
}

export function getOrderMonthTotal() {
  return request({
    url: '/channel/order/year-total-by-refType',
    method: 'get',
    params: {},
  });
}

export function getOrderMoneyMonthTotal() {
  return request({
    url: '/channel/order/month-total-of-money',
    method: 'get',
    params: {},
  });
}
