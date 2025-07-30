import request from '@/utils/request';

// 查询生产工单列表
export function listWorkorder(query) {
  return request({
    url: '/mes/pro/workorder/page',
    method: 'get',
    params: query,
  });
}

// 查询生产工单列表
export function traceWorkorderPage
(query) {
  return request({
    url: '/mes/pro/workorder/traceWorkorderPage',
    method: 'get',
    params: query,
  });
}



export function getWorkorderList(query) {
  return request({
    url: '/mes/pro/workorder/list-all',
    method: 'get',
    params: query,
  });
}

// 查询生产工单详细
export function getWorkorder(workorderId) {
  return request({
    url: '/mes/pro/workorder/get?id=' + workorderId,
    method: 'get',
  });
}

// 新增生产工单
export function addWorkorder(data) {
  return request({
    url: '/mes/pro/workorder/create',
    method: 'post',
    data: data,
  });
}

// 修改生产工单
export function updateWorkorder(data) {
  return request({
    url: '/mes/pro/workorder/update',
    method: 'put',
    data: data,
  });
}

// 删除生产工单
export function delWorkorder(workorderId) {
  return request({
    url: '/mes/pro/workorder/delete?id=' + workorderId,
    method: 'delete',
  });
}

// 查询物料依赖列表
export function listItems(query) {
  return request({
    url: '/mes/md-item/get-item-request',
    method: 'get',
    params: query,
  });
}
// 获得销售的物料明细分页
export function mixinItems(query) {
  return request({
    url: `/trade/mixin-order-item/page`,
    method: 'get',
    params: query,
  });
}

// 修改工单附件信息
export function updateWorkorderAdjuncts(data){
  return request({
    url: '/mes/pro/workorder/updateAdjuncts',
    method: 'put',
    data: data,
  });
}

export function finshWorkorder(data){
  return request({
    url: '/mes/pro/workorder/finshWorkorder',
    method: 'post',
    data: data,
  });
}

export function getWorkorderMonthCount(year) {
  year =
    {
      previous: 'lastYear',
    }[year] || 'thisYear';
  return request({
    url: `/admin-api/mes/pro/workorder/count-month-workorder-${year}`,
    method: 'get',
  });
}


export function calculateQuality(workorderId) {
  return request({
    url: '/mes/pro/workorder/calculateQuality?id=' + workorderId,
    method: 'get',
  });
}

export function reportCalculateQuality(data) {
  return request({
    url: '/mes/pro/workorder/calculateQualityBatch',
    method: 'post',
    data: data,
  });
}

