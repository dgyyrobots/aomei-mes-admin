import request from '@/utils/request';

// 查询产品销售退货行列表
export function listRtsalseline(query) {
  return request({
    url: '/mes/wms/rt-salse-line/page',
    method: 'get',
    params: query,
  });
}

// 查询产品销售退货行详细
export function getRtsalseline(lineId) {
  return request({
    url: '/mes/wms/rt-salse-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增产品销售退货行
export function addRtsalseline(data) {
  return request({
    url: '/mes/wms/rt-salse-line/create',
    method: 'post',
    data: data,
  });
}

// 修改产品销售退货行
export function updateRtsalseline(data) {
  return request({
    url: '/mes/wms/rt-salse-line/update',
    method: 'put',
    data: data,
  });
}

// 删除产品销售退货行
export function delRtsalseline(lineId) {
  return request({
    url: '/mes/wms/rt-salse-line/delete?id=' + lineId,
    method: 'delete',
  });
}


