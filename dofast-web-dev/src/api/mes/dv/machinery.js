import request from '@/utils/request';

// 查询设备列表
export function listMachinery(query) {
  return request({
    url: '/mes/cmms/dv-machinery/page',
    method: 'get',
    params: query,
  });
}

// 查询设备详细
export function getMachinery(machineryId) {
  return request({
    url: '/mes/cmms/dv-machinery/get?id=' + machineryId,
    method: 'get',
  });
}

// 新增设备
export function addMachinery(data) {
  return request({
    url: '/mes/cmms/dv-machinery/create',
    method: 'post',
    data: data,
  });
}

// 修改设备
export function updateMachinery(data) {
  return request({
    url: '/mes/cmms/dv-machinery/update',
    method: 'put',
    data: data,
  });
}

// 删除设备
export function delMachinery(machineryId) {
  return request({
    url: '/mes/cmms/dv-machinery/delete?id=' + machineryId,
    method: 'delete',
  });
}


// 查询设备列表
export function getListByProcessCode(query) {
  return request({
    url: '/mes/cmms/dv-machinery/getListByProcessCode',
    method: 'get',
    params: query,
  });
}

// 查询设备列表
export function getDeviceStatus(query) {
  return request({
    url: '/mes/cmms/dv-machinery/getDeviceStatus',
    method: 'get',
    params: query,
  });
}
