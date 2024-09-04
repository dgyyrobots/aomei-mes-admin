import request from '@/utils/request';
import { treeFilter } from '@/utils/ruoyi.js';

const areas = [];

// 获得地区树
export async function getAreaTree() {
  if (areas.length <= 0) {
    const { data } = await request({
      url: '/system/area/tree',
      method: 'get',
    });
    if (data) {
      areas.splice(0, 0, ...data);
    }
  }
  return JSON.parse(JSON.stringify(areas));
}

// 获得 IP 对应的地区名
export function getAreaByIp(ip) {
  return request({
    url: '/system/area/get-by-ip?ip=' + ip,
    method: 'get',
  });
}

// 获得 IP 对应的地区名
export function getAreaByKeyword(keyword, level) {
  return request({
    url: '/system/area/get-by-keyword',
    method: 'get',
    params: {
      keyword,
      level,
    },
  });
}

// 获得 IP 对应的地区名
export function getAreaByPid(pid) {
  return request({
    url: '/locations/get-location',
    method: 'get',
    params: {
      id: pid,
    },
  });
}

// 获得 IP 对应的地区名
export function getAreaById(id) {
  return request({
    url: '/locations/get',
    method: 'get',
    params: {
      id: id,
    },
  });
}

export async function getAreasById(id) {
  await getAreaTree();
  const _areas = [];
  treeFilter(areas, (child, parent) => {
    if (child.id == id) {
      _areas.unshift(child);
      id = parent ? parent.id : 0;
    }
  });
  return _areas;
}

export async function getAreaFieldsById(id, field = 'id') {
  const _areas = await getAreasById(id);
  return _areas.map(area => {
    return area[field];
  });
}

export async function getAreaIdByNames(names) {
  await getAreaTree();
  let id = 0;
  treeFilter(areas, (child, parent) => {
    if (child.id == id) {
      names.unshift(child.name);
      id = parent ? parent.id : 0;
    }
  });
  return id;
}

export async function getAreaIdsByNames(names = []) {
  let _areas = await getAreaTree();
  const ids = [];
  name: for (let i = 0; i < names.length; i++) {
    for (const area of _areas) {
      if (area.name == names[i]) {
        _areas = area.children;
        ids.push(area.id);
        continue name;
      }
    }
    break;
  }
  return ids;
}
