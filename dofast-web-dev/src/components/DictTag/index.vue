<template>
  <span class="static">
    <template v-for="(dict, index) in visibleOptions">
      <!-- 默认样式 -->
      <span v-if="dict.colorType === 'default' || dict.colorType === '' || dict.colorType === undefined" :key="dict.value" :index="index" :class="dict.cssClass">{{ dict.label }}</span>
      <!-- Tag 样式 -->
      <el-tag v-else :key="dict.value" :disable-transitions="true" :index="index" :type="dict.colorType" :class="dict.cssClass">
        {{ dict.label }}
      </el-tag>
    </template>
  </span>
</template>

<script>
import options from '../../utils/dict/DictOptions';

export default {
  name: 'DictTag',
  props: {
    type: String,
    options: {
      type: Array,
      default: null,
    },
    value: [Number, String, Boolean, Array],
  },
  computed: {
    values() {
      if (this.value !== null && typeof this.value !== 'undefined') {
        return Array.isArray(this.value) ? this.value : [String(this.value)];
      } else {
        return [];
      }
    },
    visibleOptions() {
      const values = this.values;
      const options = this.options;
      return options
        ? Array.prototype.filter
            .call(options, item => values.includes(item.value))
            .map(item => {
              return { ...item, ...item.raw };
            })
        : this.getDictDatas2(this.type, this.value);
    },
  },
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
