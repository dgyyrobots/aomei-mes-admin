import request from '@/utils/request';

// 查询生产任务列表
export function listProtask(query) {
  return request({
    url: '/mes/pro/task/page',
    method: 'get',
    params: query,
  });
}
// 根据订单编码查询生产任务列表
export function listProtasks(query) {
  return request({
    url: '/mes/pro/task/pageBySourceCode',
    method: 'get',
    params: query,
  });
}

// 查询我的生产任务列表
export function getTaskPage(query) {
  return request({
    url: '/mes/pro/task/get-my-task-page',
    method: 'get',
    params: query,
  });
}

// 查询生产任务列表
export function listGanttTaskList(query) {
  return request({
    url: '/mes/pro/task/listGanttTaskList',
    method: 'get',
    params: query,
  });
}

// 查询生产任务详细
export function getProtask(taskId) {
  return request({
    url: '/mes/pro/task/get?id=' + taskId,
    method: 'get',
  });
}

// 新增生产任务
export function addProtask(data) {
  return request({
    url: '/mes/pro/task/create',
    method: 'post',
    data: data,
  });
}

// 修改生产任务
export function updateProtask(data) {
  return request({
    url: '/mes/pro/task/change',
    method: 'put',
    data: data,
  });
}

// 删除生产任务
export function delProtask(taskId) {
  return request({
    url: '/mes/pro/task/delete?id=' + taskId,
    method: 'delete',
  });
}
// 一键报工创建报工记录
export function create(data) {
  return request({
    url: '/mes/pro/feedback/one-click-feedback-create',
    method: 'post',
    data: data
  });
}
// 一键报工
export function create2(data) {
  return request({
    url: '/mes/pro/feedback/one-click-create',
    method: 'put',
    data: data
  });
}

// 修改
export function updateTasks(data) {
  return request({
    url: '/mes/pro/task/update',
    method: 'put',
    data: data,
  });
}

//打印状态修改
export function updateTasksPrint(data) {
  return request({
    url: `/mes/pro/task/update/${data.id}`,
    method: 'put',
    data: data,
  });
}

// 排产
export function updateTeamById(data) {
  return request({
    url: '/mes/pro/task/updateTeamById',
    method: 'put',
    data: data,
  });
}

export function getTaskMonthCount(year) {
  year =
    {
      previous: 'lastYear',
    }[year] || 'thisYear';
  return request({
    url: `/admin-api/mes/pro/task/count-month-task-${year}`,
    method: 'get',
  });
}


