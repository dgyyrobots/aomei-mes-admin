<template>
  <el-dialog title="选择图片" v-if="showFlag" :visible.sync="showFlag" :modal="false" width="800px" center>
    <el-row v-if="list && list.length" :gutter="24">
      <el-col v-for="img in list" :span="6" :key="img">
        <div class="relative" :class="{ 'shadow-lg shadow-inner shadow-indigo': selection.includes(img), 'border-1 border-solid border-gray-5': !selection.includes(img) }" @click="toggle(img)">
          <div class="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none" v-if="selection.includes(img)" style="background-color: rgba(0, 0, 0, 0.8)"></div>
          <img :src="img" alt="" class="w-full min-h-20" />
        </div>
      </el-col>
    </el-row>
    <el-empty v-else></el-empty>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getOrderCollectionList } from '@/api/mall/trade/orderCollection';
import { flatten, uniq, compact, reduce, difference } from 'lodash';
import { getFormRecordList } from '@/api/system/formRecord';
import { getFormImages, getFormList } from '@/api/system/form';

export default {
  data() {
    return {
      showFlag: false,
      list: [],
      selection: [],
      type: '',
    };
  },
  methods: {
    open(type, ignoreImages, orders) {
      this.list = [];
      this.selection = [];
      this.type = type;
      switch (type) {
        case 'tasks':
          getOrderCollectionList({
            orderIds: orders.map(({ id }) => id).join(','),
          }).then(async res => {
            const recordIds = uniq(res.data.map(({ recordId }) => recordId).filter(id => id));
            const formIds = uniq(res.data.map(({ formId }) => formId).filter(id => id));
            const { data: records } = await getFormRecordList(recordIds);
            const { data: forms } = await getFormList(formIds);
            const formMap = forms.reduce((result, form) => {
              result[form.id] = form;
              return result;
            }, {});
            let images = [];
            for (let i = 0; i < records.length; i++) {
              const record = records[i];
              const form = formMap[record.formId];
              const _images = getFormImages(form, record);
              if (_images) {
                images = images.concat(_images);
              }
            }
            this.list = difference(uniq(images), ignoreImages);
          });
          break;
        case 'orders':
          this.list = reduce(
            [flatten, uniq, compact, res => difference(res, ignoreImages)],
            (res, fn) => fn(res),
            orders.map(({ items }) => {
              return items.map(({ picUrl }) => picUrl);
            }),
          );
          break;
        case 'goods':
          this.list = reduce(
            [flatten, uniq, compact, res => difference(res, ignoreImages)],
            (res, fn) => fn(res),
            orders.map(({ picUrls }) => {
              return picUrls;
            }),
          );
          break;
      }
      this.showFlag = true;
    },
    toggle(img) {
      const index = this.selection.indexOf(img);
      if (index == -1) {
        this.selection.push(img);
        return;
      }
      this.selection.splice(index, 1);
    },
    confirm() {
      this.$emit(
        'onSelected',
        this.selection.map(url => {
          return { url, type: this.type };
        }),
      );
      this.showFlag = false;
    },
  },
};
</script>
