import request from '@/utils/request';

// 创建采集任务类型
export function createOrderCollectionType(data) {
  return request({
    url: '/trade/order-collection-type/create',
    method: 'post',
    data: data,
  });
}

// 更新采集任务类型
export function updateOrderCollectionType(data) {
  return request({
    url: '/trade/order-collection-type/update',
    method: 'put',
    data: data,
  });
}

// 删除采集任务类型
export function deleteOrderCollectionType(id) {
  return request({
    url: '/trade/order-collection-type/delete?id=' + id,
    method: 'delete',
  });
}

// 获得采集任务类型
export function getOrderCollectionType(id) {
  return request({
    url: '/trade/order-collection-type/get?id=' + id,
    method: 'get',
  });
}

// 获得采集任务类型分页
export function getOrderCollectionTypePage(query) {
  return request({
    url: '/trade/order-collection-type/page',
    method: 'get',
    params: query,
  });
}

export function getOrderCollectionTypeList(query) {
  return request({
    url: '/trade/order-collection-type/list',
    method: 'get',
    params: query,
  });
}

export function getOrderCollectionTypeSimpleList(query) {
  return request({
    url: '/trade/order-collection-type/list-simple',
    method: 'get',
    params: query,
  });
}

// 导出采集任务类型 Excel
export function exportOrderCollectionTypeExcel(query) {
  return request({
    url: '/trade/order-collection-type/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
