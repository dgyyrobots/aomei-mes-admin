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

// 获得采购商品明细分页
export function getAllGoods(query) {
  return request({
    url: '/purchase/goods/allList',
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



// 更新采购商品状态
export function updateReceiveStatus(data) {
  return request({
    url: '/purchase/goods/updateReceiveStatus',
    method: 'put',
    data: data,
  });
}


// 开始入库
export function startWareHousing(data) {
  return request({
    url: '/purchase/goods/wareHousing',
    method: 'post',
    data: data,
  });
}

// 根据采购单号获取对于的库存信息
export function getStockInfoByPurchaseId(param) {
  return request({
    url: '/purchase/goods/getStockByPurchaseId',
    method: 'post',
    data: param,
  });
}
// 拆分入库
export function splitGoods(data) {
  return request({
    url: '/purchase/goods/splitGoods',
    method: 'post',
    data: data,
  });
}

// 根据选中行单身Id获取条码渲染内容
export function getPurchaseBarCode(id) {
  return request({
    url: '/purchase/goods/getPurchaseBarCode?id=' + rtId,
    method: 'get',
  });
}
