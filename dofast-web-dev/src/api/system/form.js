import request from '@/utils/request';

// 创建系统表单
export function createForm(data) {
  return request({
    url: '/system/form/create',
    method: 'post',
    data: data,
  });
}

// 更新系统表单
export function updateForm(data) {
  return request({
    url: '/system/form/update',
    method: 'put',
    data: data,
  });
}

// 删除系统表单
export function deleteForm(id) {
  return request({
    url: '/system/form/delete?id=' + id,
    method: 'delete',
  });
}

// 获得系统表单
export function getForm(id) {
  return request({
    url: '/system/form/get?id=' + id,
    method: 'get',
  }).then(res => {
    let fields = [
      {
        type: 'OneImgField',
        default: [{ remark: '', image: '' }],
        field: 'main',
      },
      {
        type: 'File',
        field: 'files',
        default: '',
      },
    ];
    if (res.data && /.*测量任务.*/.test(res.data.name)) {
      fields = [
        {
          type: 'TwoImgField',
          field: 'main',
          default: [{ remark: '', result: '', mark_image: '', result_image: '' }],
        },
      ];
    }
    res.data = {
      ...res.data,
      fields,
    };
    return res;
  });
}

// 获得系统表单
export function getFormList(ids) {
  if (!ids || ids.length < 1) {
    return Promise.resolve({ data: [] });
  }
  return request({
    url: '/system/form/list?ids=' + ids.join(','),
    method: 'get',
  }).then(res => {
    res.data = res.data.map(item => {
      let fields = [
        {
          type: 'OneImgField',
          default: [{ remark: '', image: '' }],
          field: 'main',
        },
        {
          type: 'File',
          field: 'files',
          default: '',
        },
      ];
      if (item && /.*测量任务.*/.test(item.name)) {
        fields = [
          {
            type: 'TwoImgField',
            field: 'main',
            default: [{ remark: '', result: '', mark_image: '', result_image: '' }],
          },
        ];
      }
      return {
        ...item,
        fields,
      };
    });
    return res;
  });
}

// 获得系统表单分页
export function getFormPage(query) {
  return request({
    url: '/system/form/page',
    method: 'get',
    params: query,
  });
}

// 获得系统表单列表
export function getFormSimpleList(query) {
  return request({
    url: '/system/form/list-simple',
    method: 'get',
    params: query,
  });
}

// 导出系统表单 Excel
export function exportFormExcel(query) {
  return request({
    url: '/system/form/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

export function getFormImages(form, record) {
  record = typeof record.value == 'string' ? JSON.parse(record.value) : record.value || {};
  const fields = typeof form.fields == 'string' ? JSON.parse(form.fields) : form.fields || [];
  const images = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field) {
      const value = record ? record[field.field] : null;
      if (!value) {
        break;
      }
      if (field.type == 'TwoImgField') {
        value.forEach(item => {
          item && item.mark_image && images.push(item.mark_image);
          item && item.result_image && images.push(item.result_image);
        });
      } else if (field.type == 'OneImgField') {
        value.forEach(item => {
          item && item.image && images.push(item.image);
        });
      } else if (field.type == 'File') {
        value.split(',').forEach(file => {
          if (file && /.*\.(png|jpg|jpeg|gif)/.test(file)) {
            images.push(file);
          }
        });
      }
    }
  }
  return images;
}
