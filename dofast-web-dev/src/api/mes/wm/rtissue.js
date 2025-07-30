import request from '@/utils/request';

// 查询生产退料单头列表
export function listRtissue(query) {
  return request({
    url: '/mes/wms/rt-issue/page',
    method: 'get',
    params: query,
  });
}

// 查询生产退料单头详细
export function getRtissue(rtId) {
  return request({
    url: '/mes/wms/rt-issue/get?id=' + rtId,
    method: 'get',
  });
}

// 新增生产退料单头
export function addRtissue(data) {
  return request({
    url: '/mes/wms/rt-issue/create',
    method: 'post',
    data: data,
  });
}

// 修改生产退料单头
export function updateRtissue(data) {
  return request({
    url: '/mes/wms/rt-issue/update',
    method: 'put',
    data: data,
  });
}

export function execute(rtId) {
  return request({
    url: '/mes/wms/rt-issue/' + rtId,
    method: 'put',
  });
}

// 删除生产退料单头
export function delRtissue(rtId) {
  return request({
    url: '/mes/wms/rt-issue/delete?id=' + rtId,
    method: 'delete',
  });
}

// 查询生产退料单头详细
export function rtissueErp(rtId) {
  return request({
    url: '/mes/wms/rt-issue/rtissueErp?id=' + rtId,
    method: 'get',
  });
}
