import request from '@/utils/request';

// 查询装箱单列表
export function listPackage(query) {
  return request({
    url: '/mes/wms/package/page',
    method: 'get',
    params: query,
  });
}

// 查询装箱单详细
export function getPackage(packageId) {
  return request({
    url: '/mes/wms/package/get?id=' + packageId,
    method: 'get',
  });
}

// 新增装箱单
export function addPackage(data) {
  return request({
    url: '/mes/wms/package/create',
    method: 'post',
    data: data,
  });
}

// 修改装箱单
export function updatePackage(data) {
  return request({
    url: '/mes/wms/package/update',
    method: 'put',
    data: data,
  });
}

// 删除装箱单
export function delPackage(packageId) {
  return request({
    url: '/mes/wms/package/delete?id=' + packageId,
    method: 'delete',
  });
}

//添加子箱
export function addSubPackage(data) {
  return request({
    url: '/mes/wms/package/addsub',
    method: 'put',
    data: data,
  });
}
