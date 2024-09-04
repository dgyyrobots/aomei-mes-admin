import request from '@/utils/request';

// 查询生产退料单行列表
export function listRtissueline(query) {
  return request({
    url: '/mes/wms/rt-issue-line/page',
    method: 'get',
    params: query,
  });
}

// 查询生产退料单行详细
export function getRtissueline(lineId) {
  return request({
    url: '/mes/wms/rt-issue-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增生产退料单行
export function addRtissueline(data) {
  return request({
    url: '/mes/wms/rt-issue-line/create',
    method: 'post',
    data: data,
  });
}

// 修改生产退料单行
export function updateRtissueline(data) {
  return request({
    url: '/mes/wms/rt-issue-line/update',
    method: 'put',
    data: data,
  });
}

// 删除生产退料单行
export function delRtissueline(lineId) {
  return request({
    url: '/mes/wms/rt-issue-line/delete?id=' + lineId,
    method: 'delete',
  });
}
