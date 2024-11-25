import request from '@/utils/request';

// 查询班组成员列表
export function listTeammember(query) {
  return request({
    url: '/cal/team-member/page',
    method: 'get',
    params: query,
  });
}

// 查询班组成员详细
export function getTeammember(memberId) {
  return request({
    url: '/cal/team-member/get?id=' + memberId,
    method: 'get',
  });
}

export function getTeammemberByTeamCode(teamCode) {
  return request({
    url: '/cal/team-member/getByTeamCode?teamCode=' + teamCode,
    method: 'get',
  });
}

// 新增班组成员
export function addTeammember(data) {
  return request({
    url: '/cal/team-member/create',
    method: 'post',
    data: data,
  });
}

// 删除班组成员
export function delTeammember(memberId) {
  return request({
    url: '/cal/team-member//delete?id=' + memberId,
    method: 'delete',
  });
}
