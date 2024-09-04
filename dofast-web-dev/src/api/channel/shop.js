import request from '@/utils/request';

// 创建店铺授权
export function createShop(data) {
  return request({
    url: '/channel/shop/create',
    method: 'post',
    data: data,
  });
}

// 更新店铺授权
export function updateShop(data) {
  return request({
    url: '/channel/shop/update',
    method: 'put',
    data: data,
  });
}

// 删除店铺授权
export function deleteShop(id) {
  return request({
    url: '/channel/shop/delete?id=' + id,
    method: 'delete',
  });
}

// 获得店铺授权
export function getShop(id) {
  return request({
    url: '/channel/shop/get?id=' + id,
    method: 'get',
  });
}

// 获得店铺授权分页
export function getShopPage(query) {
  return request({
    url: '/channel/shop/page',
    method: 'get',
    params: query,
  });
}
// TODO 获得店铺授权列表
export function listShop(query) {
  return request({
    url: '/channel/shop/page',
    method: 'get',
    params: query,
  }).then(res => {
    res.data = res.data.list;
    return res;
  });
}

// 导出店铺授权 Excel
export function exportShopExcel(query) {
  return request({
    url: '/channel/shop/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

export function getAllShop(query) {
  return request({
    url: '/channel/shop/list',
    method: 'get',
    params: query,
  });
}

export function syncShop(shopCode) {
  return request({
    url: '/channel/shop/sync-by-code',
    method: 'post',
    data: { shopCode },
  });
}
