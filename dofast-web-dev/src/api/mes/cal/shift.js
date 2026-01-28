import request from '@/utils/request';

// 查询计划班次列表
export function listShift(query) {
  return request({
    url: '/cal/shift/page',
    method: 'get',
    params: query,
  });
}

// 查询计划班次详细
export function getShift(shiftId) {
  return request({
    url: '/cal/shift/get?id=' + shiftId,
    method: 'get',
  });
}

// 新增计划班次
export function addShift(data) {
  return request({
    url: '/cal/shift/create',
    method: 'post',
    data: data,
  });
}

// 修改计划班次
export function updateShift(data) {
  return request({
    url: '/cal/shift/update',
    method: 'put',
    data: data,
  });
}

// 删除计划班次
export function delShift(shiftId) {
  return request({
    url: '/cal/shift/delete?id=' + shiftId,
    method: 'delete',
  });
}
