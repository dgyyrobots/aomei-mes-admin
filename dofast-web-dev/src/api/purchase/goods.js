import request from '@/utils/request';

// 创建采购商品明细
export function createGoods(data) {
  return request({
    url: '/purchase/goods/create',
    method: 'post',
    data: data,
  });
}

// 更新采购商品明细
export function updateGoods(data) {
  return request({
    url: '/purchase/goods/update',
    method: 'put',
    data: data,
  });
}

// 删除采购商品明细
export function deleteGoods(id) {
  return request({
    url: '/purchase/goods/delete?id=' + id,
    method: 'delete',
  });
}

// 获得采购商品明细
export function getGoods(id) {
  return request({
    url: '/purchase/goods/get?id=' + id,
    method: 'get',
  });
}

// 获得采购商品明细分页
export function getGoodsPage(query) {
  return request({
    url: '/purchase/goods/page',
    method: 'get',
    params: query,
  });
}

// 导出采购商品明细 Excel
export function exportGoodsExcel(query) {
  return request({
    url: '/purchase/goods/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
