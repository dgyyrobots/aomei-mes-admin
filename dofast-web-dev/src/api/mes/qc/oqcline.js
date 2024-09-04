import request from '@/utils/request';

// 查询出货检验单行列表
export function listOqcline(query) {
  return request({
    url: '/mes/qms/oqc-line/page',
    method: 'get',
    params: query,
  });
}

// 查询出货检验单行详细
export function getOqcline(lineId) {
  return request({
    url: '/mes/qms/oqc-line/get?id=' + lineId,
    method: 'get',
  });
}

// 新增出货检验单行
export function addOqcline(data) {
  return request({
    url: '/mes/qms/oqc-line/create',
    method: 'post',
    data: data,
  });
}

// 修改出货检验单行
export function updateOqcline(data) {
  return request({
    url: '/mes/qms/oqc-line/update',
    method: 'put',
    data: data,
  });
}

// 删除出货检验单行
export function delOqcline(lineId) {
  return request({
    url: '/mes/qms/oqc-line/delete?id=' + lineId,
    method: 'delete',
  });
}
