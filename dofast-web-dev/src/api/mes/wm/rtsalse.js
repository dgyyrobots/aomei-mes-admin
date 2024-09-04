import request from '@/utils/request';

// 查询产品销售退货单列表
export function listRtsalse(query) {
  return request({
    url: '/mes/wms/rt-salse/page',
    method: 'get',
    params: query,
  });
}

// 查询产品销售退货单详细
export function getRtsalse(rtId) {
  return request({
    url: '/mes/wms/rt-salse/get?id=' + rtId,
    method: 'get',
  });
}

// 新增产品销售退货单
export function addRtsalse(data) {
  return request({
    url: '/mes/wms/rt-salse/create',
    method: 'post',
    data: data,
  });
}

// 修改产品销售退货单
export function updateRtsalse(data) {
  return request({
    url: '/mes/wms/rt-salse/update',
    method: 'put',
    data: data,
  });
}

// 删除产品销售退货单
export function delRtsalse(rtId) {
  return request({
    url: '/mes/wms/rt-salse/delete?id=' + rtId,
    method: 'delete',
  });
}

export function execute(rtId) {
  return request({
    url: '/mes/wms/rt-salse/' + rtId,
    method: 'put',
  });
}
