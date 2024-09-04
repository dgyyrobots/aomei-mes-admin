<template>
  <div class="flex t-0 l-0 absolute w-full min-h-full">
    <div class="w-120 bg-white p-5">
      <el-alert type="success" show-icon title="双击插入最后"></el-alert>
      <template v-for="(item, i) in components">
        <el-divider>{{ item.name }}</el-divider>
        <el-row :gutter="15">
          <el-col :span="6" v-for="(child, i) in item.children" :key="i" class="mb-5">
            <div class="py-5 border border-solid border-gray text-center">
              <svg-icon v-if="child.iconType == 'svg'" :icon-class="child.icon" class-name="text-10"></svg-icon>
              <i class="text-10" :class="child.icon" v-else />
              <div class="mt-1">{{ child.label }}</div>
            </div>
          </el-col>
        </el-row>
      </template>
    </div>
    <div class="flex-1 min-w-60 flex flex-col">
      <div class="flex-1 flex flex-center bg-gray-100 overflow-y-auto">
        <iframe class="border-0 w-100 min-h-180" :src="'/h5/index.html#/pages/index/design?id=' + this.form_id"></iframe>
      </div>
      <div class="h-20 bg-white flex flex-center">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </div>
    <el-tabs type="border-card" class="w-120">
      <el-tab-pane label="页面属性">
        <el-form label-position="top">
          <template v-for="(field, i) in baseFields">
            <el-form-item :label="field.label" :key="i">
              <el-input v-model="baseConfig[field.field]" :placeholder="field.placeholder" />
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="组件属性" v-if="selectedFieldConfigFields && selectedFieldConfigFields.length">
        <el-form label-position="top">
          <template v-for="(field, i) in selectedFieldConfigFields">
            <el-form-item :label="field.label" :key="i">
              <el-input v-model="selectedFieldConfig[field.field]" :placeholder="field.placeholder" />
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import components from '@/assets/data/components.yml';
import SvgIcon from '@/components/SvgIcon/index.vue';

console.log(components);
export default {
  components: { SvgIcon },
  data() {
    return {
      form_id: '',
      list: [],
      selectedFieldIndex: -1,
      components: components,
      baseConfig: {
        title: '',
      },
      baseFields: [{ field: 'title', type: 'input', label: '标题', placeholder: '请输入表单的标题' }],
    };
  },
  computed: {
    selectedFieldConfig() {
      return this.list[this.selectedFieldIndex] || null;
    },
    selectedFieldConfigFields() {
      if (this.selectedFieldConfig) {
        for (let i = 0; i < this.components.length; i++) {
          if (this.components[i].type == this.selectedFieldConfig.type) {
            return this.components[i].componentFields;
          }
        }
      }
      return [];
    },
  },
  created() {
    this.form_id = this.$route.query.form_id;
  },
  activated() {
    this.form_id = this.$route.query.form_id;
  },
};
</script>
