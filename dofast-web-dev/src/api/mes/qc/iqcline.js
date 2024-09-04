import request from '@/utils/request';

// 查询来料检验单行列表
export function listIqcline(query) {
  return request({
    url: '/mes/qms/iqc-line/page',
    method: 'get',
    params: query,
  });
}

// 查询来料检验单行详细
export function getIqcline(lineId) {
  return request({
    url: '/mes/qms/iqc-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增来料检验单行
export function addIqcline(data) {
  return request({
    url: '/mes/qms/iqc-line/create',
    method: 'post',
    data: data,
  });
}

// 修改来料检验单行
export function updateIqcline(data) {
  return request({
    url: '/mes/qms/iqc-line/update',
    method: 'put',
    data: data,
  });
}

// 删除来料检验单行
export function delIqcline(lineId) {
  return request({
    url: '/mes/qms/iqc-line/delete?id=' + lineId,
    method: 'delete',
  });
}
