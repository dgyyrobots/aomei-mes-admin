import request from '@/utils/request';

export function getAddressListByUserId(userId) {
  return request({
    // url: '/member/address/list-of-user?userId=' + userId,
    url: '/member/address/list?userId=' + userId,
    method: 'GET',
  });
}

export function createMemberAddress(data) {
  return request({
    url: '/member/address/create',
    method: 'POST',
    data,
  });
}
