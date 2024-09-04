<template>
  <easy-panel @refresh="getList()">
    <el-table :loading="loading" :data="list">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="任务类型" align="center" prop="typeName" />
      <el-table-column label="订单" align="center" prop="orderNo">
        <template v-slot="scope">
          <el-link underline @click="$router.push({ name: 'TradeOrderDetail', query: { id: scope.row.orderId } })">
            {{ scope.row.orderNo }}
          </el-link>
        </template>
      </el-table-column>
      <!--      <el-table-column label="记录者" align="center" prop="recorder" />-->
      <el-table-column label="记录" align="center" prop="recordId" width="180">
        <template v-slot="scope">
          <el-link size="mini" type="scope.row.recordId?'primary': 'default'" icon="el-icon-edit" @click="handleUpdateRecord(scope.row)" v-hasPermi="['trade:order-collection:update']">
            {{ scope.row.recordId ? '已记录' : '未记录' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" align="center" prop="recordTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.recordTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.TRADE_ORDER_COLLECTION_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <RecordDialog ref="remarkDialog" @success="setRecord"></RecordDialog>
  </easy-panel>
</template>
<script>
import easyPanel from './easy-panel.vue';
import { getOrderCollectionListByMixinOrderId } from '@/api/mall/trade/orderCollection';
import RecordDialog from '@/views/mall/trade/orderCollection/record.vue';

export default {
  props: ['orderId'],
  components: {
    RecordDialog,
    easyPanel,
  },
  data() {
    return {
      loading: false,
      list: [],
      currentRow: null,
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
      getOrderCollectionListByMixinOrderId({
        mixinOrderId: this.orderId,
      }).then(res => {
        this.list = res.data;
      });
    },
    handleUpdateRecord(row) {
      this.currentRow = row;
      this.$refs.remarkDialog.open(row);
    },
    setRecord(data) {
      this.getList();
    },
  },
};
</script>
