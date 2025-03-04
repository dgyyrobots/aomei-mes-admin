import hasRole from './permission/hasRole';
import hasPermi from './permission/hasPermi';
import dialogDrag from './dialog/drag';
import dialogDragWidth from './dialog/dragWidth';
import dialogDragHeight from './dialog/dragHeight';
import clipboard from './module/clipboard';

// Vue：自定义指令：https://v2.cn.vuejs.org/v2/guide/custom-directive.html
const install = function (Vue) {
  Vue.directive('hasRole', hasRole);
  Vue.directive('hasPermi', hasPermi);
  Vue.directive('clipboard', clipboard);
  Vue.directive('dialogDrag', dialogDrag);
  Vue.directive('dialogDragWidth', dialogDragWidth);
  Vue.directive('dialogDragHeight', dialogDragHeight);
  Vue.directive('minio-src', {
    inserted: async function(el, binding) { //指令名称为：real-img
      let imgURL = binding.value; //获取图片地址
      if (imgURL) {
        const protocol = window.location.protocol;
        const host = window.location.host;
        imgURL = imgURL.replaceAll(process.env.VUE_APP_MINIO_HOST,protocol+"//"+host+"/minio");
        console.log("minio-url",imgURL);
        el.setAttribute('src', imgURL);
      }
    }
  })
};

if (window.Vue) {
  window['hasRole'] = hasRole;
  window['hasPermi'] = hasPermi;
  Vue.use(install); // eslint-disable-line
}

export default install;
