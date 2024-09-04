import request from '@/utils/request';

// 查询物料入库单行列表
export function listItemrecptline(query) {
  return request({
    url: '/mes/wms/item-recpt-line/page',
    method: 'get',
    params: query,
  });
}

// 查询物料入库单行详细
export function getItemrecptline(lineId) {
  return request({
    url: '/mes/wms/item-recpt-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增物料入库单行
export function addItemrecptline(data) {
  return request({
    url: '/mes/wms/item-recpt-line/create',
    method: 'post',
    data: data,
  });
}

// 修改物料入库单行
export function updateItemrecptline(data) {
  return request({
    url: '/mes/wms/item-recpt-line/update',
    method: 'put',
    data: data,
  });
}

// 删除物料入库单行
export function delItemrecptline(lineId) {
  return request({
    url: '/mes/wms/item-recpt-line/delete?id=' + lineId,
    method: 'delete',
  });
}
