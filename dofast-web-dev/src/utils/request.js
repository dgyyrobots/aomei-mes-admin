import axios from 'axios';
import { Message as ElementMessage, MessageBox, Notification, Loading } from 'element-ui';
import store from '@/store';
import { getAccessToken, getRefreshToken, getTenantId, setToken } from '@/utils/auth';
import errorCode from '@/utils/errorCode';
import { getPath, getTenantEnable, blobValidate, tansParams } from '@/utils/ruoyi';
import cache from '@/plugins/cache';
import { refreshToken } from '@/api/login';
import { saveAs } from 'file-saver';

const loop = () => { };
let downloadLoadingInstance;
let refreshTokenPromise;
let ReadyMessage = loop;
// 需要忽略的提示。忽略后，自动 Promise.reject('error')
const ignoreMsgs = [
  '无效的刷新令牌', // 刷新令牌被删除时，不用提示
  '刷新令牌已过期', // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
];
const unique_tasks = [];
const isUniqueLocked = headers => {
  const key = headers['x-unique-key'];
  if (!key) {
    return false;
  }
  if (unique_tasks.indexOf(key) < 0) {
    unique_tasks.push(key);
    return false;
  }
  return Promise.reject(new Error('重复的请求'));
};
const unlockUnique = headers => {
  const key = headers['x-unique-key'];
  if (!key) {
    return;
  }
  if (unique_tasks.indexOf(key) < 0) {
    return;
  }
  unique_tasks.splice(unique_tasks.indexOf(key), 1);
};

// 是否显示重新登录
export const isRelogin = { show: false };
// Axios 无感知刷新令牌，参考 https://www.dashingdog.cn/article/11 与 https://segmentfault.com/a/1190000020210980 实现
// 请求队列
let requestList = [];
// 是否正在刷新中
let isRefreshToken = false;
// 校验当前请求IP
let isExternal = window.location.hostname !== '172.18.12.250';
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API, // 此处的 /admin-api/ 地址，原因是后端的基础路径为 /admin-api/
  // 超时
  timeout: 60000,
  // 禁用 Cookie 等信息
  withCredentials: false,
});
// request拦截器
service.interceptors.request.use(
  config => {
    // 唯一性请求判断
    const unique = isUniqueLocked(config.headers || {});
    if (unique) {
      return unique;
    }
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // //content-type变化
    // if (config.headers["Content-Type"]) {
    //   axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    // }
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (getAccessToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getAccessToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // 设置租户
    if (getTenantEnable()) {
      const tenantId = getTenantId();
      if (tenantId) {
        config.headers['tenant-id'] = tenantId;
      }
    }
    let url = config.url;
    if (!/^(http\:\/|https\:\/|\/mock-api|\/admin-api|\/prod-api)\/.*/.test(url)) {
      url = '/admin-api/' + url;
      url = url.replace(/\/{2}/g, '/');
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      url += '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
    }
    config.url = url;
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime(),
      };
      const sessionObj = cache.session.getJSON('sessionObj');
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj);
      } else {
        const s_url = sessionObj.url; // 请求地址
        const s_data = sessionObj.data; // 请求数据
        const s_time = sessionObj.time; // 请求时间
        const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        const is_not_get = config.method && config.method.toUpperCase() != 'GET';
        if (is_not_get && s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message);
          return Promise.reject(new Error(message));
        } else {
          cache.session.setJSON('sessionObj', requestObj);
        }
      }
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  async res => {
    unlockUnique(res.config.headers || {});
    const Message = ReadyMessage;
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = res.data.msg || errorCode[code] || errorCode['default'];
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }
    if (ignoreMsgs.indexOf(msg) !== -1) {
      // 如果是忽略的错误码，直接返回 msg 异常
      return Promise.reject(msg);
    } else if (code === 401) {
      // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
      if (!isRefreshToken) {
        isRefreshToken = true;
        // 1. 如果获取不到刷新令牌，则只能执行登出操作
        if (!getRefreshToken()) {
          return handleAuthorized();
        }
        // 2. 进行刷新访问令牌
        try {
          const refreshTokenRes = await (refreshTokenPromise ? refreshTokenPromise : (refreshTokenPromise = refreshToken()));
          // 2.1 刷新成功，则回放队列的请求 + 当前请求
          setToken(refreshTokenRes.data);
          requestList.forEach(cb => cb());
          const result = await service(res.config);
          console.log(result);
          return result;
        } catch (e) {
          console.log(e);
          // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
          // 2.2 刷新失败，只回放队列的请求
          requestList.forEach(cb => cb());
          // 提示是否要登出。即不回放当前请求！不然会形成递归
          return handleAuthorized();
        } finally {
          requestList = [];
          isRefreshToken = false;
        }
      } else {
        // 添加到队列，等待刷新获取到新的令牌
        return new Promise(resolve => {
          requestList.push(() => {
            res.config.headers['Authorization'] = 'Bearer ' + getAccessToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
            resolve(service(res.config));
          });
        });
      }
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error',
      });
      return Promise.reject(new Error(msg));
    } else if (code === 501) {
      Message({
        type: 'error',
        duration: 0,
        message: msg,
      });
      return Promise.reject(new Error(msg));
    } else if (code === 901) {
      Message({
        type: 'error',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<div>演示模式，无法进行写操作</div>' + '<div> &nbsp; </div>' + '<div>参考 https://doc.huizhizao.vip/ 教程</div>' + '<div> &nbsp; </div>' + '<div>5 分钟搭建本地环境</div>',
      });
      return Promise.reject(new Error(msg));
      // 拒绝审核状态码715003
    } else if (code !== 200 && code != 715003) {
      if (msg === '无效的刷新令牌') {
        // hard coding：忽略这个提示，直接登出
        console.log(msg);
      } else {
        Notification.error({
          title: msg,
        });
      }
      return Promise.reject('error');
    } else {
      return res.data;
    }
  },
  error => {
    unlockUnique(error && error.config ? error.config.headers : {});
    const Message = ReadyMessage;
    console.log('err' + error);
    let { message } = error;
    if (message === 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export function getBaseHeader() {
  return {
    Authorization: 'Bearer ' + getAccessToken(),
    'tenant-id': getTenantId(),
  };
}

function handleAuthorized() {
  console.log(ReadyMessage == loop, isRelogin.show + '');
  if (!isRelogin.show) {
    isRelogin.show = true;
    if (ReadyMessage == loop) {
      setTimeout(() => {
        isRelogin.show = false;
        store.dispatch('LogOut').then(() => {
          location.href = getPath('/index');
        });
      });
    } else {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          isRelogin.show = false;
          store.dispatch('LogOut').then(() => {
            location.href = getPath('/index');
          });
        })
        .catch(() => {
          isRelogin.show = false;
        });
    }
  }
  return Promise.reject('登录已失效，请重新登录。');
}

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({
    text: '正在下载数据，请稍候',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  return service
    .post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params);
        },
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
    })
    .then(async data => {
      const isLogin = await blobValidate(data);
      if (isLogin) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
        Message.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch(r => {
      console.error(r);
      Message.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}

export const initMessage = () => {
  ReadyMessage = ElementMessage;
};

export default service;
