import request from '@/utils/request';

// 查询库位设置列表
export function listArea(query) {
  return request({
    url: '/mes/wms/storage-area/page',
    method: 'get',
    params: query,
  });
}

// 查询库位设置详细
export function getArea(areaId) {
  return request({
    url: '/mes/wms/storage-area/get?id=' + areaId,
    method: 'get',
  });
}

// 新增库位设置
export function addArea(data) {
  return request({
    url: '/mes/wms/storage-area/create',
    method: 'post',
    data: data,
  });
}

// 修改库位设置
export function updateArea(data) {
  return request({
    url: '/mes/wms/storage-area/update',
    method: 'put',
    data: data,
  });
}

// 删除库位设置
export function delArea(areaId) {
  return request({
    url: '/mes/wms/storage-area/delete?id=' + areaId,
    method: 'delete',
  });
}
