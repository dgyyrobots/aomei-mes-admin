import request from '@/utils/request';

// 查询出货检验单列表
export function listOqc(query) {
  return request({
    url: '/mes/qms/oqc/page',
    method: 'get',
    params: query,
  });
}

// 查询出货检验单详细
export function getOqc(oqcId) {
  return request({
    url: '/mes/qms/oqc/get?id=' + oqcId,
    method: 'get',
  });
}

// 新增出货检验单
export function addOqc(data) {
  return request({
    url: '/mes/qms/oqc/create',
    method: 'post',
    data: data,
  });
}

// 修改出货检验单
export function updateOqc(data) {
  return request({
    url: '/mes/qms/oqc/update',
    method: 'put',
    data: data,
  });
}

// 删除出货检验单
export function delOqc(oqcId) {
  return request({
    url: '/mes/qms/oqc/delete?id=' + oqcId,
    method: 'delete',
  });
}
