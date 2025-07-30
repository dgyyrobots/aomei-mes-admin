import request from '@/utils/request';

// 查询库存记录列表
export function listWmstock(query) {
  return request({
    url: '/mes/wms/material-stock/page',
    method: 'get',
    params: query,
  });
}

// 查询库存记录详细
export function getWmstock(materialStockId) {
  return request({
    url: '/mes/wms/material-stock/get?id=' + materialStockId,
    method: 'get',
  });
}

// 新增库存记录
export function addWmstock(data) {
  return request({
    url: '/mes/wms/material-stock/create',
    method: 'post',
    data: data,
  });
}

// 修改库存记录
export function updateWmstock(data) {
  return request({
    url: '/mes/wms/material-stock/update',
    method: 'put',
    data: data,
  });
}

// 删除库存记录
export function delWmstock(materialStockId) {
  return request({
    url: '/mes/wms/material-stock/delete?id=' + materialStockId,
    method: 'delete',
  });
}


// 导出库存 Excel
export function exportExcel(query) {
  return request({
    url: '/mes/wms/material-stock/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
