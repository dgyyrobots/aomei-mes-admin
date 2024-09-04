import request from '@/utils/request'


// 更新会员配置
export function updateConfig(data) {
  return request({
    url: '/member/config/save',
    method: 'put',
    data: data
  })
}


// 获得会员配置
export function getConfig() {
  return request({
    url: '/member/config/get',
    method: 'get'
  })
}

