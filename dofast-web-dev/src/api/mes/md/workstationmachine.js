import request from '@/utils/request';

// 查询设备资源列表
export function listWorkstationmachine(query) {
  return request({
    url: '/mes/md-workstation-machine/page',
    method: 'get',
    params: query,
  });
}

// 查询设备资源详细
export function getWorkstationmachine(recordId) {
  return request({
    url: '/mes/md-workstation-machine/get?id=' + recordId,
    method: 'get',
  });
}

// 新增设备资源
export function addWorkstationmachine(data) {
  return request({
    url: '/mes/md-workstation-machine/create',
    method: 'post',
    data: data,
  });
}

// 修改设备资源
export function updateWorkstationmachine(data) {
  return request({
    url: '/mes/md-workstation-machine/update',
    method: 'put',
    data: data,
  });
}

// 删除设备资源
export function delWorkstationmachine(recordId) {
  return request({
    url: '/mes/md-workstation-machine/delete?id=' + recordId,
    method: 'delete',
  });
}
