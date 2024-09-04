import request from '@/utils/request';

// 查询生产报工记录列表
export function listFeedback(query) {
  return request({
    url: '/mes/pro/feedback/page',
    method: 'get',
    params: query,
  });
}

// 查询生产报工记录详细
export function getFeedback(recordId) {
  return request({
    url: '/mes/pro/feedback/get?id=' + recordId,
    method: 'get',
  });
}

// 新增生产报工记录
export function addFeedback(data) {
  return request({
    url: '/mes/pro/feedback/create',
    method: 'post',
    data: data,
  });
}

// 修改生产报工记录
export function updateFeedback(data) {
  return request({
    url: '/mes/pro/feedback/update',
    method: 'put',
    data: data,
  });
}

// 删除生产报工记录
export function delFeedback(recordId) {
  return request({
    url: '/mes/pro/feedback/delete?id=' + recordId,
    method: 'delete',
  });
}

export function execute(recordId) {
  return request({
    url: '/mes/pro/feedback/' + recordId,
    method: 'put',
  });
}
//增加-审核是否通过
export function executes(data) {
  return request({
    url: `/mes/pro/feedback/update-feedback-status?id=${data.id}&status=${data.status}`,
    method: 'put',
    // data: data
  });
}
