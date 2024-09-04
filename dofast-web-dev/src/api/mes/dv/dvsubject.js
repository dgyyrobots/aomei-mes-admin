import request from '@/utils/request';

// 查询设备点检保养项目列表
export function listDvsubject(query) {
  return request({
    url: '/mes/cmms/dv-subject/page',
    method: 'get',
    params: query,
  });
}

// 查询设备点检保养项目详细
export function getDvsubject(subjectId) {
  return request({
    url: '/mes/cmms/dv-subject/get?id=' + subjectId,
    method: 'get',
  });
}

// 新增设备点检保养项目
export function addDvsubject(data) {
  return request({
    url: '/mes/cmms/dv-subject/create',
    method: 'post',
    data: data,
  });
}

// 修改设备点检保养项目
export function updateDvsubject(data) {
  return request({
    url: '/mes/cmms/dv-subject/update',
    method: 'put',
    data: data,
  });
}

// 删除设备点检保养项目
export function delDvsubject(subjectId) {
  return request({
    url: '/mes/cmms/dv-subject/delete?id=' + subjectId,
    method: 'delete',
  });
}
