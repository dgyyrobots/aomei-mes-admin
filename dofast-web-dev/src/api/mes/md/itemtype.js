import request from '@/utils/request';

// 查询部门列表
// TODO 分页
export function listItemType(query) {
  return request({
    url: '/mes/md-item-type/page',
    method: 'get',
    params: query,
  });
}

// 查询物料类型树形列表
// TODO 不分页
export function treeItemType(query) {
  return request({
    url: '/mes/md-item-type/list-all',
    method: 'get',
    params: query,
  });
}

// 查询部门列表（排除节点）
export function listItemTypeExcludeChild(itemTypeId) {
  return request({
    url: '/mes/md-item-type/list/exclude/' + itemTypeId,
    method: 'get',
  });
}

// 查询部门详细
export function getItemType(itemTypeId) {
  return request({
    url: '/mes/md-item-type/get?id=' + itemTypeId,
    method: 'get',
  });
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/mes/md-item-type/treeselect',
    method: 'get',
  });
}

// 新增部门
export function addItemType(data) {
  return request({
    url: '/mes/md-item-type/create',
    method: 'post',
    data: data,
  });
}

// 修改部门
export function updateItemType(data) {
  return request({
    url: '/mes/md-item-type/update',
    method: 'put',
    data: data,
  });
}

// 删除部门
export function delItemType(itemTypeId) {
  return request({
    url: '/mes/md-item-type/delete?id=' + itemTypeId,
    method: 'delete',
  });
}
