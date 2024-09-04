import request from '@/utils/request';

// 创建销售订单
export function createMixinOrder(data) {
  return request({
    url: '/trade/mixin-order/create',
    method: 'post',
    data: data,
  });
}
// 创建销售订单2
export function createMixinOrder2(data) {
  return request({
    url: '/channel/sales-order/create',
    method: 'post',
    data: data,
  });
}

// 更新销售订单
export function updateMixinOrder(data) {
  return request({
    url: '/trade/mixin-order/update',
    method: 'put',
    data: data,
  });
}

// 删除销售订单
export function deleteMixinOrder(id) {
  return request({
    url: '/trade/mixin-order/delete?id=' + id,
    method: 'delete',
  });
}

// 获得销售订单
export function getMixinOrder(id) {
  return request({
    url: '/trade/mixin-order/get?id=' + id,
    method: 'get',
  });
}

// 获得销售订单分页
export function getMixinOrderPage(query) {
  return request({
    url: '/trade/mixin-order/page',
    method: 'get',
    params: query,
  });
}

// 导出销售订单 Excel
export function exportMixinOrderExcel(query) {
  return request({
    url: '/trade/mixin-order/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

// 获得销售订单详情
export function getDetail(query) {
  return request({
    url: '/admin-api/trade/mixin-order/get-detail',
    method: 'get',
    params: query,
  });
}
// 更新销售订单状态
export function updateStat(query) {
  return request({
    url: `/admin-api/trade/mixin-order/update-state?id=${query.id}&state=${query.state}`,
    method: 'put',
  });
}
// 更新销售订单打印状态
export function updatePrintStat(query) {
  return request({
    url: `/admin-api/trade/mixin-order/update/${query.id}`,
    method: 'put',
  });
}
// 根据销售单id创建物料明细
export function updateStatWl(data) {
  return request({
    url: `/trade/mixin-order-item/create-by-id?id=${data.id}&ids=${data.ids}`,
    method: 'post',
  });
}
