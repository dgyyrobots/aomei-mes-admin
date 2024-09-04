import Vue from 'vue';

import VueCodeMirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/liquibyte.css'; // 导入选中的theme主题,与初始化theme配置一致
import 'codemirror/mode/css/css.js'; // 导入使用的语言语法定义文件，初始化mode配置一致
import 'codemirror/mode/xml/xml.js'; // 导入使用的语言语法定义文件，初始化mode配置一致
import 'codemirror/mode/javascript/javascript.js'; // 导入使用的语言语法定义文件，初始化mode配置一致
import Element from 'element-ui';
import './assets/styles/element-variables.scss';

import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/ruoyi.scss'; // ruoyi css
import 'uno.css';

import App from './App';
import store from './store';
import router from './router';
import directive from './directive'; // directive
import plugins from './plugins'; // plugins

import './assets/icons'; // icon
import './permission'; // permission control
import './tongji'; // 百度统计
import { getDicts } from '@/api/system/dict/data';
import { getConfigKey } from '@/api/infra/config';
import { parseTime, resetForm, handleTree, treeFilter, addBeginAndEndTime, divide, addDateRange, selectDictLabel, selectDictLabels } from '@/utils/ruoyi';
import Pagination from '@/components/Pagination';
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar';
// 字典数据组件
import DictData from '@/components/DictData';
// 代码高亮插件
// import hljs from 'highlight.js'
// import 'highlight.js/styles/github-gist.css'
import { DICT_TYPE, getDictDataLabel, getDictDatas, getDictDatas2 } from '@/utils/dict';
// Mqtt工具
//import mqttTool from '@/utils/mqttTool'

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.getDictDatas = getDictDatas;
Vue.prototype.getDictDatas2 = getDictDatas2;
Vue.prototype.getDictDataLabel = getDictDataLabel;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.DICT_TYPE = DICT_TYPE;
Vue.prototype.handleTree = handleTree;
Vue.prototype.treeFilter = treeFilter;
Vue.prototype.addBeginAndEndTime = addBeginAndEndTime;
Vue.prototype.divide = divide;
//Vue.prototype.$mqttTool = mqttTool

// 全局组件挂载
Vue.component('DictTag', DictTag);
Vue.component('DocAlert', DocAlert);
Vue.component('Pagination', Pagination);
Vue.component('RightToolbar', RightToolbar);
// 字典标签组件
import DictTag from '@/components/DictTag';
import DocAlert from '@/components/DocAlert';
// 头部标签插件
import VueMeta from 'vue-meta';

Vue.use(directive);
Vue.use(plugins);
Vue.use(VueMeta);
Vue.use(DictData);
Vue.use(VueCodeMirror);
// Vue.use(hljs.vuePlugin);

// bpmnProcessDesigner 需要引入
import MyPD from '@/components/bpmnProcessDesigner/package/index.js';
Vue.use(MyPD);
import '@/components/bpmnProcessDesigner/package/theme/index.scss';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

// Form Generator 组件需要使用到 tinymce
import Tinymce from '@/components/tinymce/index.vue';
Vue.component('tinymce', Tinymce);
import '@/assets/icons';
import request, { initMessage } from '@/utils/request'; // 实现 form generator 使用自己定义的 axios request 对象

Vue.prototype.$axios = request;
import '@/styles/index.scss';

// 默认点击背景不关闭弹窗
import ElementUI from 'element-ui';
ElementUI.Dialog.props.closeOnClickModal.default = false;

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: localStorage.getItem('size') || 'medium', // set element-ui default size
});

Vue.config.productionTip = false;

router.afterEach(() => {
  initMessage();
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
