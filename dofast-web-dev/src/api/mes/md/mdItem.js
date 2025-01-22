import request from '@/utils/request';

// 查询物料列表
export function listMdItem(query) {
  return request({
    url: '/mes/md-item/page',
    method: 'get',
    params: query,
  });
}

// 查询物料详细
export function getMdItem(itemId) {
  return request({
    url: '/mes/md-item/get?id=' + itemId,
    method: 'get',
  });
}

// 新增物料
export function addMdItem(data) {
  return request({
    url: '/mes/md-item/create',
    method: 'post',
    data: data,
  });
}

// 修改物料
export function updateMdItem(data) {
  return request({
    url: '/mes/md-item/update',
    method: 'put',
    data: data,
  });
}

// 删除物料
export function delMdItem(itemId) {
  return request({
    url: '/mes/md-item/delete?id=' + itemId,
    method: 'delete',
  });
}

// 修改工单附件
export function updateMdItemAdjuncts(data) {
  return request({
    url: '/mes/md-item/updateMdItemAdjuncts',
    method: 'put',
    data: data,
  });
}
