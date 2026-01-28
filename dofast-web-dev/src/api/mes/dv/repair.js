import request from '@/utils/request';

// 查询设备维修单列表
export function listRepair(query) {
  return request({
    url: '/mes/cmms/dv-repair/page',
    method: 'get',
    params: query,
  });
}

// 查询设备维修单详细
export function getRepair(repairId) {
  return request({
    url: '/mes/cmms/dv-repair/get?id=' + repairId,
    method: 'get',
  });
}

// 新增设备维修单
export function addRepair(data) {
  return request({
    url: '/mes/cmms/dv-repair/create',
    method: 'post',
    data: data,
  });
}

// 修改设备维修单
export function updateRepair(data) {
  return request({
    url: '/mes/cmms/dv-repair/update',
    method: 'put',
    data: data,
  });
}

// 删除设备维修单
export function delRepair(repairId) {
  return request({
    url: '/mes/cmms/dv-repair/delete' + repairId,
    method: 'delete',
  });
}

// 完成维修单
export function finshRepair(ids) {
  return request({
    url: '/mes/cmms/dv-repair/finsh?ids=' + ids,
    method: 'get',
  })
}
