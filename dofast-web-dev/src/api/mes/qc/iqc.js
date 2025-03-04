import request from '@/utils/request';

// 查询来料检验单列表
export function listIqc(query) {
  return request({
    url: '/mes/qms/iqc/page',
    method: 'get',
    params: query,
  });
}

// 查询来料检验单详细
export function getIqc(iqcId) {
  return request({
    url: '/mes/qms/iqc/get?id=' + iqcId,
    method: 'get',
  });
}

// 新增来料检验单
export function addIqc(data) {
  return request({
    url: '/mes/qms/iqc/create',
    method: 'post',
    data: data,
  });
}

// 修改来料检验单
export function updateIqc(data) {
  return request({
    url: '/mes/qms/iqc/update',
    method: 'put',
    data: data,
  });
}

// 删除来料检验单
export function delIqc(iqcId) {
  return request({
    url: '/mes/qms/iqc/delete?id=' + iqcId,
    method: 'delete',
  });
}

// 修改附件
export function updateIqcAdjuncts(data) {
  return request({
    url: '/mes/qms/iqc/updateIqcAdjuncts',
    method: 'put',
    data: data,
  });
}
