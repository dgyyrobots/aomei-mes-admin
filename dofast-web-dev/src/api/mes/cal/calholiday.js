import request from '@/utils/request';

// 查询节假日设置列表
export function listCalholiday(query) {
  return request({
    url: '/cal/holiday/list',
    method: 'get',
    params: query,
  });
}

// 查询节假日设置详细
export function getCalholiday(holidayId) {
  return request({
    url: '/cal/holiday/get?id=' + holidayId,
    method: 'get',
  });
}

// 新增节假日设置
export function addCalholiday(data) {
  return request({
    url: '/cal/holiday/create',
    method: 'post',
    data: data,
  });
}

// 修改节假日设置
export function updateCalholiday(data) {
  return request({
    url: '/cal/holiday/update',
    method: 'put',
    data: data,
  });
}

// 删除节假日设置
export function delCalholiday(holidayId) {
  return request({
    url: '/cal/holiday/delete?id=' + holidayId,
    method: 'delete',
  });
}
