import request from '@/utils/request';

// 查询工装夹具清单列表
export function listTool(query) {
  return request({
    url: '/tm/tool/page',
    method: 'get',
    params: query,
  });
}

// 查询工装夹具清单详细
export function getTool(toolId) {
  return request({
    url: '/tm/tool/get?id=' + toolId,
    method: 'get',
  });
}

// 新增工装夹具清单
export function addTool(data) {
  return request({
    url: '/tm/tool/create',
    method: 'post',
    data: data,
  });
}

// 修改工装夹具清单
export function updateTool(data) {
  return request({
    url: '/tm/tool/update',
    method: 'put',
    data: data,
  });
}

// 删除工装夹具清单
export function delTool(toolId) {
  return request({
    url: '/tm/tool/delete?id=' + toolId,
    method: 'delete',
  });
}
