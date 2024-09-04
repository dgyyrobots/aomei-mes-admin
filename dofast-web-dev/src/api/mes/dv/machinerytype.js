import request from '@/utils/request';

// 查询设备类型列表
export function pageMachinerytype(query) {
  return request({
    url: '/mes/cmms/dv-machinery-type/page',
    method: 'get',
    params: query,
  });
}

// 查询设备类型树形列表
export function treeMachinerytype(query) {
  return request({
    url: '/mes/cmms/dv-machinery-type/listall',
    method: 'get',
    params: query,
  });
}

// 查询设备类型列表
export function listMachinerytype(query) {
  return request({
    url: '/mes/cmms/dv-machinery-type/list',
    method: 'get',
    params: query,
  });
}

// 查询设备类型详细
export function getMachinerytype(machineryTypeId) {
  return request({
    url: '/mes/cmms/dv-machinery-type/get?machineryTypeId=' + machineryTypeId,
    method: 'get',
  });
}

// 新增设备类型
export function addMachinerytype(data) {
  return request({
    url: '/mes/cmms/dv-machinery-type/create',
    method: 'post',
    data: data,
  });
}

// 修改设备类型
export function updateMachinerytype(data) {
  return request({
    url: '/mes/cmms/dv-machinery-type/update',
    method: 'put',
    data: data,
  });
}

// 删除设备类型
export function delMachinerytype(machineryTypeId) {
  return request({
    url: '/mes/cmms/dv-machinery-type/delete?machineryTypeId=' + machineryTypeId,
    method: 'delete',
  });
}
