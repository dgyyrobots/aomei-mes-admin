import request from '@/utils/request'

// 创建班组排班
export function createTeamSchedule(data) {
  return request({
    url: '/cal/team-schedule/create',
    method: 'post',
    data: data
  })
}

// 更新班组排班
export function updateTeamSchedule(data) {
  return request({
    url: '/cal/team-schedule/update',
    method: 'put',
    data: data
  })
}

// 删除班组排班
export function deleteTeamSchedule(id) {
  return request({
    url: '/cal/team-schedule/delete?id=' + id,
    method: 'delete'
  })
}

// 获得班组排班
export function getTeamSchedule(id) {
  return request({
    url: '/cal/team-schedule/get?id=' + id,
    method: 'get'
  })
}

// 获得班组排班分页
export function listTeamSchedule(query) {
  return request({
    url: '/cal/team-schedule/page',
    method: 'get',
    params: query
  })
}

// 导出班组排班 Excel
export function exportTeamScheduleExcel(query) {
  return request({
    url: '/cal/team-schedule/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
