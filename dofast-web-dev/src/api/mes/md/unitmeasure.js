import request from '@/utils/request';

// 查询单位列表
export function listUnitmeasure(query) {
  return request({
    url: '/mes/md-unit-measure/page',
    method: 'get',
    params: query,
  });
}

export function listPrimaryUnitmeasure() {
  return request({
    url: '/mes/md-unit-measure/listprimary',
    method: 'get',
  });
}

export function listAllUnitmeasure() {
  return request({
    url: '/mes/md-unit-measure/selectall',
    method: 'get',
  });
}

// 查询单位详细
export function getUnitmeasure(measureId) {
  return request({
    url: '/mes/md-unit-measure/get?id=' + measureId,
    method: 'get',
  });
}

// 新增单位
export function addUnitmeasure(data) {
  return request({
    url: '/mes/md-unit-measure/create',
    method: 'post',
    data: data,
  });
}

// 修改单位
export function updateUnitmeasure(data) {
  return request({
    url: '/mes/md-unit-measure/update',
    method: 'put',
    data: data,
  });
}

// 删除单位
export function delUnitmeasure(measureId) {
  return request({
    url: '/mes/md-unit-measure/delete?id=' + measureId,
    method: 'delete',
  });
}
