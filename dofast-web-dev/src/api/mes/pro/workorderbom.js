import request from '@/utils/request';

// 查询生产工单BOM组成列表
export function listWorkorderbom(query) {
  return request({
    url: '/mes/pro/workorder-bom/page',
    method: 'get',
    params: query,
  });
}

// 查询生产工单BOM组成详细
export function getWorkorderbom(lineId) {
  return request({
    url: '/mes/pro/workorder-bom/get?id=' + lineId,
    method: 'get',
  });
}

// 新增生产工单BOM组成
export function addWorkorderbom(data) {
  return request({
    url: '/mes/pro/workorder-bom/create',
    method: 'post',
    data: data,
  });
}

// 修改生产工单BOM组成
export function updateWorkorderbom(data) {
  return request({
    url: '/mes/pro/workorder-bom/update',
    method: 'put',
    data: data,
  });
}

// 删除生产工单BOM组成
export function delWorkorderbom(lineId) {
  return request({
    url: '/mes/pro/workorder-bom/delete?id=' + lineId,
    method: 'delete',
  });
}
