<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div class="action-bar" :style="{ 'text-align': 'left' }">
        <span class="bar-btn" @click="refresh">
          <i class="el-icon-refresh" />
          刷新
        </span>
        <span ref="copyBtn" class="bar-btn copy-json-btn">
          <i class="el-icon-document-copy" />
          复制JSON
        </span>
        <span class="bar-btn" @click="exportJsonFile">
          <i class="el-icon-download" />
          导出JSON文件
        </span>
        <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
          <i class="el-icon-circle-close" />
          关闭
        </span>
      </div>
      <codemirror ref="jsonEditor" v-if="codemirrorOptions.value" class="json-editor" :value="codemirrorOptions.value" :options="codemirrorOptions" style="height: 100%" />
    </el-drawer>
  </div>
</template>

<script>
import { beautifierConf } from '@/utils';
import ClipboardJS from 'clipboard';
import { saveAs } from 'file-saver';
import loadBeautifier from '@/utils/loadBeautifier';

let beautifier;

export default {
  components: {},
  props: {
    jsonStr: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      beautifierJson: '',
    };
  },
  computed: {
    codemirrorOptions() {
      return {
        value: this.beautifierJson,
        theme: 'liquibyte',
        // language: 'json',
        mode: 'application/json',
        automaticLayout: true,
      };
    },
  },
  watch: {},
  created() {},
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave);
    const clipboard = new ClipboardJS('.copy-json-btn', {
      text: trigger => {
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success',
        });
        return this.beautifierJson;
      },
    });
    clipboard.on('error', e => {
      this.$message.error('代码复制失败');
    });
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave);
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    },
    onOpen() {
      loadBeautifier(btf => {
        beautifier = btf;
        this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js);
      });
    },
    onClose() {},
    onKeyDown(e) {
      if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
        this.refresh();
      }
    },
    exportJsonFile() {
      this.$prompt('文件名:', '导出文件', {
        inputValue: `${+new Date()}.json`,
        closeOnClickModal: false,
        inputPlaceholder: '请输入文件名',
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.json`;
        const codeStr = this.jsonEditor.codemirror.getValue();
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, value);
      });
    },
    refresh() {
      try {
        this.$emit('refresh', JSON.parse(this.jsonEditor.codemirror.getValue()));
      } catch (error) {
        this.$notify({
          title: '错误',
          message: 'JSON格式错误，请检查',
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

:deep(.el-drawer__header) {
  display: none;
}
@include action-bar;

.json-editor {
  height: calc(100vh - 33px);
}
</style>
