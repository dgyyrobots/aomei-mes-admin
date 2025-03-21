import request from '@/utils/request';

// 查询转移单行列表
export function listTransferline(query) {
  return request({
    url: '/mes/wms/transfer-line/page',
    method: 'get',
    params: query,
  });
}

// 查询转移单行详细
export function getTransferline(lineId) {
  return request({
    url: '/mes/wms/transfer-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增转移单行
export function addTransferline(data) {
  return request({
    url: '/mes/wms/transfer-line/create',
    method: 'post',
    data: data,
  });
}

// 修改转移单行
export function updateTransferline(data) {
  return request({
    url: '/mes/wms/transfer-line/update',
    method: 'put',
    data: data,
  });
}

// 删除转移单行
export function delTransferline(lineId) {
  return request({
    url: '/mes/wms/transfer-line/delete?id=' + lineId,
    method: 'delete',
  });
}
