// 导出参数
import request from '@/utils/request';

// 查询参数列表
export function parseAddress(content) {
  return request({
    url: '/infra/address/source',
    method: 'get',
    params: { content },
  });
}
