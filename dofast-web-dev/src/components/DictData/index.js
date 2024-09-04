import DataDict from '@/utils/dict/index.js';

function install(Vue) {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {
          return Promise.resolve(this.getDictDatas(dictMeta.type));
        },
      },
    },
  });
}

export default {
  install,
};
