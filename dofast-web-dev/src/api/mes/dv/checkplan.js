import request from '@/utils/request';

// 查询设备点检计划头列表
export function listCheckplan(query) {
  return request({
    url: '/mes/cmms/dv-check-plan/page',
    method: 'get',
    params: query,
  });
}

// 查询设备点检计划头详细
export function getCheckplan(planId) {
  return request({
    url: '/mes/cmms/dv-check-plan/get?id=' + planId,
    method: 'get',
  });
}

// 新增设备点检计划头
export function addCheckplan(data) {
  return request({
    url: '/mes/cmms/dv-check-plan/create',
    method: 'post',
    data: data,
  });
}

// 修改设备点检计划头
export function updateCheckplan(data) {
  return request({
    url: '/mes/cmms/dv-check-plan/update',
    method: 'put',
    data: data,
  });
}

// 删除设备点检计划头
export function delCheckplan(planId) {
  return request({
    url: '/mes/cmms/dv-check-plan/delete?id=' + planId,
    method: 'delete',
  });
}
