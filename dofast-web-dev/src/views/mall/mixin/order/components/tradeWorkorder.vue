<template>
  <easy-panel @refresh="getList()">
    <el-table v-loading="loading" :data="list" row-key="id" default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="工单编码" width="180" prop="workorderCode" align="center" />
      <el-table-column label="工单名称" width="200" align="center" prop="workorderName" :show-overflow-tooltip="true" />
      <el-table-column label="工单来源" align="center" prop="orderSource">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_workorder_sourcetype" :value="scope.row.orderSource" />
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="140" align="center" prop="sourceCode" />
      <el-table-column label="产品编号" width="120" align="center" prop="productCode" />
      <el-table-column label="产品名称" width="200" align="center" prop="productName" :show-overflow-tooltip="true" />
      <el-table-column label="规格型号" align="center" prop="productSpc" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="工单数量" align="center" prop="quantity" />
      <el-table-column label="调整数量" align="center" prop="quantityChanged" />
      <el-table-column label="已生产数量" align="center" width="100px" prop="quantityProduced" />
      <el-table-column label="批次号" align="center" width="100px" prop="batchCode" />
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" :show-overflow-tooltip="true" />
      <el-table-column label="需求日期" align="center" prop="requestDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requestDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>
    </el-table>
  </easy-panel>
</template>
<script>
import easyPanel from './easy-panel.vue';
import { getWorkorderList } from '@/api/mes/pro/workorder';

export default {
  props: ['orderId'],
  dicts: ['mes_order_status', 'mes_workorder_sourcetype'],
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
      getWorkorderList({
        mixinOrderId: this.orderId,
      }).then(res => {
        this.list = this.handleTree(res.data, 'id', 'parentId');
      });
    },
  },
};
</script>
