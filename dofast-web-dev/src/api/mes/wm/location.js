import request from '@/utils/request';

// 查询库区设置列表
export function listLocation(query) {
  return request({
    url: '/mes/wms/storage-location/page',
    method: 'get',
    params: query,
  });
}

// 查询库区设置详细
export function getLocation(locationId) {
  return request({
    url: '/mes/wms/storage-location/get?id=' + locationId,
    method: 'get',
  });
}

// 新增库区设置
export function addLocation(data) {
  return request({
    url: '/mes/wms/storage-location/create',
    method: 'post',
    data: data,
  });
}

// 修改库区设置
export function updateLocation(data) {
  return request({
    url: '/mes/wms/storage-location/update',
    method: 'put',
    data: data,
  });
}

// 删除库区设置
export function delLocation(locationId) {
  return request({
    url: '/mes/wms/storage-location/delete?id=' + locationId,
    method: 'delete',
  });
}
