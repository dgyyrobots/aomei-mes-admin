import request from '@/utils/request';

// 查询供应商退货行列表
export function listRtvendorline(query) {
  return request({
    url: '/mes/wms/rt-vendor-line/page',
    method: 'get',
    params: query,
  });
}

// 查询供应商退货行详细
export function getRtvendorline(lineId) {
  return request({
    url: '/mes/wms/rt-vendor-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增供应商退货行
export function addRtvendorline(data) {
  return request({
    url: '/mes/wms/rt-vendor-line/create',
    method: 'post',
    data: data,
  });
}

// 修改供应商退货行
export function updateRtvendorline(data) {
  return request({
    url: '/mes/wms/rt-vendor-line/update',
    method: 'put',
    data: data,
  });
}

// 删除供应商退货行
export function delRtvendorline(lineId) {
  return request({
    url: '/mes/wms/rt-vendor-line/delete' + lineId,
    method: 'delete',
  });
}
