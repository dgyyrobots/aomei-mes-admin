import request from '@/utils/request';

// 删除文件
export function deleteFile(fileName) {
  return request({
    url: '/infra/file/delete?fileName=' + fileName,
    method: 'delete',
  });
}

// 获得文件分页
export function getFilePage(query) {
  return request({
    url: '/infra/file/page',
    method: 'get',
    params: query,
  });
}

// 获取文件实际路径
export function getFullUrl(url) {
  return request({
    url: '/infra/file/getFullUrl',
    method: 'post',
    data: url
  })
}



