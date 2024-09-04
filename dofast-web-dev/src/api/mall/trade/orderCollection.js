import request from '@/utils/request';

// 创建采集任务
export function createOrderCollection(data) {
  return request({
    url: '/trade/order-collection/create',
    method: 'post',
    data: data,
  });
}

// 更新采集任务
export function updateOrderCollection(data) {
  return request({
    url: '/trade/order-collection/update',
    method: 'put',
    data: data,
  });
}

// 删除采集任务
export function deleteOrderCollection(id) {
  return request({
    url: '/trade/order-collection/delete?id=' + id,
    method: 'delete',
  });
}

// 获得采集任务
export function getOrderCollection(id) {
  return request({
    url: '/trade/order-collection/get?id=' + id,
    method: 'get',
  });
}

// 获得采集任务分页
export function getOrderCollectionPage(query) {
  return request({
    url: '/trade/order-collection/page',
    method: 'get',
    params: query,
  });
}

// 获得采集任务列表
export function getOrderCollectionList(query) {
  return request({
    url: '/trade/order-collection/list-all',
    method: 'get',
    params: query,
  });
}

// 获得采集任务列表
export function getOrderCollectionListByMixinOrderId(query) {
  return request({
    url: '/trade/order-collection/list-all-by-mixin-order-id',
    method: 'get',
    params: query,
  });
}

// 导出采集任务 Excel
export function exportOrderCollectionExcel(query) {
  return request({
    url: '/trade/order-collection/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

export function updateOrderCollectionStatus(id, status) {
  return request({
    url: '/trade/order-collection/update-status',
    method: 'post',
    data: { id, status },
  });
}
