import request from '@/utils/request';

// 创建运费模板细节
export function createExpressTemplateItem(data) {
  return request({
    url: '/system/express-template-item/create',
    method: 'post',
    data: data,
  });
}

// 更新运费模板细节
export function updateExpressTemplateItem(data) {
  return request({
    url: '/system/express-template-item/update',
    method: 'put',
    data: data,
  });
}

// 删除运费模板细节
export function deleteExpressTemplateItem(id) {
  return request({
    url: '/system/express-template-item/delete?id=' + id,
    method: 'delete',
  });
}

// 获得运费模板细节
export function getExpressTemplateItem(id) {
  return request({
    url: '/system/express-template-item/get?id=' + id,
    method: 'get',
  });
}

// 获得运费模板细节分页
export function getExpressTemplateItemPage(query) {
  return request({
    url: '/system/express-template-item/page',
    method: 'get',
    params: query,
  });
}

// 导出运费模板细节 Excel
export function exportExpressTemplateItemExcel(query) {
  return request({
    url: '/system/express-template-item/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
