import request from '@/utils/request';

// 查询生产工序列表
export function listProcess(query) {
  return request({
    url: '/mes/pro/cess/page',
    method: 'get',
    params: query,
  });
}

// 查询所有有效生产工序
export function listAllProcess() {
  return request({
    url: '/mes/pro/cess/list-all-simple',
    method: 'get',
  });
}

// 查询生产工序详细
export function getProcess(processId) {
  return request({
    url: '/mes/pro/cess/get?id=' + processId,
    method: 'get',
  });
}

// 新增生产工序
export function addProcess(data) {
  return request({
    url: '/mes/pro/cess/create',
    method: 'post',
    data: data,
  });
}

// 修改生产工序
export function updateProcess(data) {
  return request({
    url: '/mes/pro/cess/update',
    method: 'put',
    data: data,
  });
}

// 删除生产工序
export function delProcess(processId) {
  return request({
    url: '/mes/pro/cess/delete?id=' + processId,
    method: 'delete',
  });
}
