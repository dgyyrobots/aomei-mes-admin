<template>
  <easy-panel @refresh="syncCollectionImages()">
    <div class="cursor-pointer group-item w-56 h-36 overflow-hidden relative inline-block mr-5 mb-5" v-for="(pic, i) in pics" :key="i">
      <img :src="pic" class="w-full" />
      <div class="flex-center inset-0 absolute group-item-hover-visible bg-gray-4 bg-opacity-50">
        <div class="p-2" @click="$emit('preview', i, pics)">
          <i class="el-icon-view c-white text-10"></i>
        </div>
        <div class="p-2" v-if="action == 'workorder'" @click="$emit('plus', pic)">
          <i class="el-icon-plus c-white text-10"></i>
        </div>
      </div>
    </div>
  </easy-panel>
</template>

<script>
import easyPanel from './easy-panel.vue';
import { getOrderCollectionListByMixinOrderId } from '@/api/mall/trade/orderCollection';
import { getFormRecordList } from '@/api/system/formRecord';
import { getFormImages, getFormList } from '@/api/system/form';
import { uniq } from 'lodash';

export default {
  components: { easyPanel },
  props: ['orderId', 'action'],
  data() {
    return {
      pics: [],
    };
  },
  watch: {
    orderId: {
      handler: 'syncCollectionImages',
      immediate: true,
    },
  },
  methods: {
    async syncCollectionImages() {
      if (!this.orderId) {
        return;
      }
      const { data: collections } = await getOrderCollectionListByMixinOrderId({
        mixinOrderId: this.orderId,
      });
      const recordIds = uniq(collections.map(({ recordId }) => recordId).filter(id => id));
      const formIds = uniq(collections.map(({ formId }) => formId).filter(id => id));
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
      this.pics = uniq(images);
    },
  },
};
</script>
