<template>
  <easy-panel @refresh="getList()">
    <el-table :loading="loading" :data="list">
      <el-table-column prop="orderId" label="来源">
        <template v-slot="{ row }">
          <div>{{ row.tradeOrderId ? '商城订单' : '销售订单' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="orderId" label="订单">
        <template v-slot="{ row }">
          <el-link v-if="row.tradeOrderId">{{ row.tradeOrderId }}</el-link>
          <div v-else>{{ orderId }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template v-slot="{ row }">
          <dict-tag :type="DICT_TYPE.TRADE_ORDER_REMARK_TYPE" :value="row.type"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建者"></el-table-column>
      <el-table-column prop="remark" label="内容"></el-table-column>
      <el-table-column prop="sortCode" label="排序"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="{ row }">
          <div>{{ parseTime(row.createTime) }}</div>
        </template>
      </el-table-column>
    </el-table>
  </easy-panel>
</template>
<script>
import easyPanel from './easy-panel.vue';
import { getOrderRemarkList } from '@/api/mall/trade/orderRemark';

export default {
  props: ['orderId'],
  components: {
    easyPanel,
  },
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  watch: {
    orderId: {
      handler: 'getList',
      immediate: true,
    },
  },
  methods: {
    getList() {
      if (!this.orderId) {
        this.list = [];
        return;
      }
      getOrderRemarkList({
        mixin_order_id: this.orderId,
      }).then(res => {
        this.list = res.data;
      });
    },
  },
};
</script>
