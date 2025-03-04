import request from '@/utils/request';

// 查询工艺路线列表
export function listProroute(query) {
  return request({
    url: '/mes/pro/route/page',
    method: 'get',
    params: query,
  });
}

// 查询工艺路线详细
export function getProroute(routeId) {
  return request({
    url: '/mes/pro/route/get?id=' + routeId,
    method: 'get',
  });
}

// 新增工艺路线
export function addProroute(data) {
  return request({
    url: '/mes/pro/route/create',
    method: 'post',
    data: data,
  });
}

// 修改工艺路线
export function updateProroute(data) {
  return request({
    url: '/mes/pro/route/update',
    method: 'put',
    data: data,
  });
}

// 修改工单附件信息
export function updateProrouteFile(data){
  return request({
    url: '/mes/pro/route/updateFile',
    method: 'put',
    data: data,
  });
}


// 删除工艺路线
export function delProroute(routeId) {
  return request({
    url: '/mes/pro/route/delete?id=' + routeId,
    method: 'delete',
  });
}

// 基于物料料号获取工艺编号
export function getRouteCodeByItemCode(itemCode) {
  return request({
    url: '/mes/pro/route/initRouteCodeByItemCode?itemCode=' + itemCode,
    method: 'get',
  });
}

