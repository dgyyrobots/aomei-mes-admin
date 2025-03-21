import request from '@/utils/request';

// 查询生产领料单行列表
export function listIssueline(query) {
  return request({
    url: '/mes/wms/issue-line/page',
    method: 'get',
    params: query,
  });
}

// 查询生产领料单行详细
export function getIssueline(lineId) {
  return request({
    url: '/mes/wms/issue-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增生产领料单行
export function addIssueline(data) {
  return request({
    url: '/mes/wms/issue-line/create',
    method: 'post',
    data: data,
  });
}

// 修改生产领料单行
export function updateIssueline(data) {
  return request({
    url: '/mes/wms/issue-line/update',
    method: 'put',
    data: data,
  });
}

// 删除生产领料单行
export function delIssueline(lineId) {
  return request({
    url: '/mes/wms/issue-line/delete?id=' + lineId,
    method: 'delete',
  });
}


// 修改生产领料单行
export function updateEnable(data) {
  return request({
    url: '/mes/wms/issue-line/updateEnable',
    method: 'put',
    data: data,
  });
}
