import request from '@/utils/request';

// 查询检验单缺陷记录列表
export function listDefectrecord(query) {
  return request({
    url: '/mes/qms/defect-record/page',
    method: 'get',
    params: query,
  });
}

// 查询检验单缺陷记录详细
export function getDefectrecord(recordId) {
  return request({
    url: '/mes/qms/defect-record/get?id=' + recordId,
    method: 'get',
  });
}

// 新增检验单缺陷记录
export function addDefectrecord(data) {
  return request({
    url: '/mes/qms/defect-record/create',
    method: 'post',
    data: data,
  });
}

// 修改检验单缺陷记录
export function updateDefectrecord(data) {
  return request({
    url: '/mes/qms/defect-record/update-or-create',
    // url: '/mes/qms/defect-record/update',
    method: 'put',
    data: data,
  });
}

// 删除检验单缺陷记录
export function delDefectrecord(recordId) {
  return request({
    url: '/mes/qms/defect-record/delete?id=' + recordId,
    method: 'delete',
  });
}
