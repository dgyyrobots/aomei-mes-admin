import request from '@/utils/request';

// 查询生产领料单头列表
export function listIssueheader(query) {
  return request({
    url: '/wms/issue-header/page',
    method: 'get',
    params: query,
  });
}

// 查询生产领料单头详细
export function getIssueheader(issueId) {
  return request({
    url: '/wms/issue-header/get?id=' + issueId,
    method: 'get',
  });
}

// 新增生产领料单头
export function addIssueheader(data) {
  return request({
    url: '/wms/issue-header/create',
    method: 'post',
    data: data,
  });
}

// 修改生产领料单头
export function updateIssueheader(data) {
  return request({
    url: '/wms/issue-header/update',
    method: 'put',
    data: data,
  });
}


// 修改生产领料单头
export function updateIssueMachinery(data) {
  return request({
    url: '/wms/issue-header/updateMachinery',
    method: 'put',
    data: data,
  });
}

// 删除生产领料单头
export function delIssueheader(issueId) {
  return request({
    url: '/wms/issue-header/delete?id=' + issueId,
    method: 'delete',
  });
}

//执行出库
export function execute(issueId) {
  return request({
    url: '/wms/issue-header/' + issueId,
    method: 'put',
  });
}

// 更新调拨单头
export function finshIssueHeader(id) {
  return request({
    url: '/wms/issue-header/finsh?id=' + id,
    method: 'get',
  })
}
