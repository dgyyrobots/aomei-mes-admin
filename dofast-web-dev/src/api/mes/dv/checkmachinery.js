import request from '@/utils/request';

// 查询点检设备列表
export function listCheckmachinery(query) {
  return request({
    url: '/mes/cmms/dv-check-machinery/page',
    method: 'get',
    params: query,
  });
}

// 查询点检设备详细
export function getCheckmachinery(recordId) {
  return request({
    url: '/mes/cmms/dv-check-machinery/get' + recordId,
    method: 'get',
  });
}

// 新增点检设备
export function addCheckmachinery(data) {
  return request({
    url: '/mes/cmms/dv-check-machinery/create',
    method: 'post',
    data: data,
  });
}

// 修改点检设备
export function updateCheckmachinery(data) {
  return request({
    url: '/mes/cmms/dv-check-machinery/update',
    method: 'put',
    data: data,
  });
}

// 删除点检设备
export function delCheckmachinery(recordId) {
  return request({
    url: '/mes/cmms/dv-check-machinery/' + recordId,
    method: 'delete',
  });
}
