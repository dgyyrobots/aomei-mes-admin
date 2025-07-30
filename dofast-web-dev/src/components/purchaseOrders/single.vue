<template>
  <el-dialog title="采购单选择" v-if="showFlag" :visible.sync="showFlag" :modal="false" width="80%" center>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="110px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="采购单号" prop="poNo">
            <el-input v-model="queryParams.poNo" placeholder="请输入采购单号" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"> </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="purchaseOrderList" @current-change="handleCurrent"
              @row-dblclick="handleRowDbClick">
      <el-table-column width="55" align="center">
        <template v-slot="scope">
          <el-radio v-model="selectedPurchaseOrdersId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
            }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="采购单号" align="center" prop="poNo" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSelect">确 定</el-button>
      <el-button @click="showFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getGoodsPage} from '@/api/purchase/goods';

import { createOrder, updateOrder, deleteOrder, getOrder, getOrderPage, exportOrderExcel } from '@/api/purchase/order';

export default {
  name: 'PurchaseOrderSingle',
  dicts: ['purchase_status'],
  data() {
    return {
      showFlag: false,
      // 遮罩层
      loading: true,
      // 选中数组
      selectedPurchaseOrdersId: undefined,
      selectedRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      purchaseOrderList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        supplierId: null,
        supplierContact: null,
        supplierPhone: null,
        purchaseAmount: null,
        poNo: null,
        paymentType: null,
        returnGoods: null,
        processType: null,
        remarks: null,
        createTime: [],
      },
      // 表单参数
      form: {},
    };
  },
  props: {
    processId: undefined, //外部传入的工序过滤条件
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询采购商品列表 */
    getList() {
      this.loading = true;
      getOrderPage(this.queryParams).then(response => {
        this.purchaseOrderList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        supplierId: undefined,
        supplierContact: undefined,
        supplierPhone: undefined,
        purchaseAmount: undefined,
        id: undefined,
        poNo: undefined,
        paymentType: undefined,
        returnGoods: undefined,
        processType: undefined,
        remarks: undefined,
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleCurrent(row) {
      if (row) {
        this.selectedRows = row;
      }
    },
    // 单选选中数据
    handleRowChange(row) {
      if (row) {
        this.selectedRows = row;
      }
    },
    //双击选中
    handleRowDbClick(row) {
      if (row) {
        this.selectedRows = row;
        this.$emit('onSelected', this.selectedRows);
        this.showFlag = false;
      }
    },
    //确定选中
    confirmSelect() {
      if (this.selectedPurchaseOrdersId == null || this.selectedPurchaseOrdersId == 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请至少选择一条数据!',
        });
        return;
      }
      this.$emit('onSelected', this.selectedRows);
      this.showFlag = false;
    },
  },
};
</script>
