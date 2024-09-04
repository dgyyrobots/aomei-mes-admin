<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="供应商" prop="supplierId">
        <el-input v-model="queryParams.supplierId" placeholder="请输入供应商" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商联系人" prop="supplierContact" label-width="96">
        <el-input v-model="queryParams.supplierContact" placeholder="请输入供应商联系人" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商联系人电话" prop="supplierPhone" label-width="124">
        <el-input v-model="queryParams.supplierPhone" placeholder="请输入供应商联系人电话" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="采购金额" prop="purchaseAmount">
        <el-input v-model="queryParams.purchaseAmount" placeholder="请输入采购金额" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="采购单号" prop="poNo">
        <el-input v-model="queryParams.poNo" placeholder="请输入采购单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="付款类型" prop="paymentType">
        <el-select v-model="queryParams.paymentType" placeholder="请选择付款类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PURCHASE_INVOICE_PAY_WAY)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="退货状态" prop="returnGoods">
        <el-select v-model="queryParams.returnGoods" placeholder="请选择退货状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核类型" prop="processType">
        <el-select v-model="queryParams.processType" placeholder="请选择审核类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PURCHASE_ORDER_AUDIT_STATUS)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="queryParams.remarks" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['purchase:order:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['purchase:order:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="供应商" align="center" prop="supplierId" />
      <el-table-column label="供应商联系人" align="center" prop="supplierContact" />
      <el-table-column label="供应商联系人电话" align="center" prop="supplierPhone" />
      <el-table-column label="采购金额" align="center" prop="purchaseAmount" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="采购单号" align="center" prop="poNo" />
      <el-table-column label="付款类型" align="center" prop="paymentType">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.PURCHASE_INVOICE_PAY_WAY" :value="scope.row.paymentType" />
        </template>
      </el-table-column>
      <el-table-column label="退货状态" align="center" prop="returnGoods">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.returnGoods" />
        </template>
      </el-table-column>
      <el-table-column label="审核类型" align="center" prop="processType">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.PURCHASE_ORDER_AUDIT_STATUS" :value="scope.row.processType" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['purchase:order:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['purchase:order:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="供应商" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="供应商联系人" prop="supplierContact">
          <el-input v-model="form.supplierContact" placeholder="请输入供应商联系人" />
        </el-form-item>
        <el-form-item label="供应商联系人电话" prop="supplierPhone">
          <el-input v-model="form.supplierPhone" placeholder="请输入供应商联系人电话" />
        </el-form-item>
        <el-form-item label="采购金额" prop="purchaseAmount">
          <el-input v-model="form.purchaseAmount" placeholder="请输入采购金额" />
        </el-form-item>
        <el-form-item label="采购单号" prop="poNo">
          <el-input v-model="form.poNo" placeholder="请输入采购单号" />
        </el-form-item>
        <el-form-item label="付款类型" prop="paymentType">
          <el-select v-model="form.paymentType" placeholder="请选择付款类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PURCHASE_INVOICE_PAY_WAY)" :key="dict.value"
              :label="dict.label" :value="parseInt(dict.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="退货状态" prop="returnGoods">
          <el-select v-model="form.returnGoods" placeholder="请选择退货状态">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
              :label="dict.label" :value="parseInt(dict.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核类型" prop="processType">
          <el-select v-model="form.processType" placeholder="请选择审核类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PURCHASE_ORDER_AUDIT_STATUS)" :key="dict.value"
              :label="dict.label" :value="parseInt(dict.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createOrder, updateOrder, deleteOrder, getOrder, getOrderPage, exportOrderExcel } from '@/api/purchase/order';

export default {
  name: 'Order',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 采购订单列表
      list: [],
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
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getOrderPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加采购订单';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改采购订单';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateOrder(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createOrder(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除采购订单编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteOrder(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有采购订单数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportOrderExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '采购订单.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
