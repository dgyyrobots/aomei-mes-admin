import request from '@/utils/request';

// 查询装箱明细列表
export function listPackageline(query) {
  return request({
    url: '/mes/wms/package-line/page',
    method: 'get',
    params: query,
  });
}

// 查询装箱明细详细
export function getPackageline(lineId) {
  return request({
    url: '/mes/wms/package-line/get?=id' + lineId,
    method: 'get',
  });
}

// 新增装箱明细
export function addPackageline(data) {
  return request({
    url: '/mes/wms/package-line/create',
    method: 'post',
    data: data,
  });
}

// 修改装箱明细
export function updatePackageline(data) {
  return request({
    url: '/mes/wms/package-line/update',
    method: 'put',
    data: data,
  });
}

// 删除装箱明细
export function delPackageline(lineId) {
  return request({
    url: '/mes/wms/package-line/delete?=id' + lineId,
    method: 'delete',
  });
}
