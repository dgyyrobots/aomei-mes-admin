import request from '@/utils/request';

// 创建参数配置
export function createConfig(data) {
  return request({
    url: '/system/config/create',
    method: 'post',
    data: data,
  });
}

// 更新参数配置
export function updateConfig(data) {
  return request({
    url: '/system/config/update',
    method: 'put',
    data: data,
  });
}

// 删除参数配置
export function deleteConfig(id) {
  return request({
    url: '/system/config/delete?id=' + id,
    method: 'delete',
  });
}

// 获得参数配置
export function getConfig(id) {
  return request({
    url: '/system/config/get?id=' + id,
    method: 'get',
  });
}

// 获得参数配置
export function getConfigKey(key) {
  return request({
    url: '/system/config/key/' + key,
    method: 'get',
  });
}

// 获得参数配置分页
export function getConfigPage(query) {
  return request({
    url: '/system/config/page',
    method: 'get',
    params: query,
  });
}

// 导出参数配置 Excel
export function exportConfigExcel(query) {
  return request({
    url: '/system/config/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
// 获得参数配置列表
export function getConfigList(query) {
  return request({
    url: '/system/config/list?ids=' + query,
    method: 'get',
  });
}
// 批量更新参数配置
export function cinfigUpdate(data) {
  return request({
    url: '/system/config/update-All',
    method: 'put',
    data
  });
}
// 批量更新参数配置
export function cinfigCreated(data) {
  return request({
    url: '/system/config/create-all',
    method: 'post',
    data
  });
}
