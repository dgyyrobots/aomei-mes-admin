import request from '@/utils/request';

// 查询工装夹具资源列表
export function listWorkstationtool(query) {
  return request({
    url: '/mes/md-workstation-tool/page',
    method: 'get',
    params: query,
  });
}

// 查询工装夹具资源详细
export function getWorkstationtool(recordId) {
  return request({
    url: '/mes/md-workstation-tool/get?id=' + recordId,
    method: 'get',
  });
}

// 新增工装夹具资源
export function addWorkstationtool(data) {
  return request({
    url: '/mes/md-workstation-tool/create',
    method: 'post',
    data: data,
  });
}

// 修改工装夹具资源
export function updateWorkstationtool(data) {
  return request({
    url: '/mes/md-workstation-tool/update',
    method: 'put',
    data: data,
  });
}

// 删除工装夹具资源
export function delWorkstationtool(recordId) {
  return request({
    url: '/mes/md-workstation-tool/delete?id=' + recordId,
    method: 'delete',
  });
}
