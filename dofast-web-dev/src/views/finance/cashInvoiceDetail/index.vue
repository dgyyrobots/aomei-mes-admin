<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="开票信息id" prop="invoice" label-width="81">
        <el-input v-model="queryParams.invoice" placeholder="请输入开票信息id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="项目" prop="item">
        <el-input v-model="queryParams.item" placeholder="请输入项目" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="项目类型" prop="itemType">
        <el-select v-model="queryParams.itemType" placeholder="请选择项目类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INVOICE_PRODUCT_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目id" prop="itemId">
        <el-input v-model="queryParams.itemId" placeholder="请输入项目id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="模型" prop="model">
        <el-input v-model="queryParams.model" placeholder="请输入模型" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="数量" prop="amount">
        <el-input v-model="queryParams.amount" placeholder="请输入数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="queryParams.price" placeholder="请输入价格" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="金额" prop="money">
        <el-input v-model="queryParams.money" placeholder="请输入金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="税率" prop="taxRate">
        <el-input v-model="queryParams.taxRate" placeholder="请输入税率" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="税金" prop="taxMoney">
        <el-input v-model="queryParams.taxMoney" placeholder="请输入税金" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <!-- <el-form-item label="租户id" prop="tenandId">
        <el-input v-model="queryParams.tenandId" placeholder="请输入租户id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['finance:cash-invoice-detail:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['finance:cash-invoice-detail:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="发票明细id" align="center" prop="id" />
      <el-table-column label="开票信息id" align="center" prop="invoice" />
      <el-table-column label="项目" align="center" prop="item" />
      <el-table-column label="项目类型" align="center" prop="itemType">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INVOICE_PRODUCT_TYPE" :value="scope.row.itemType" />
        </template>
      </el-table-column>
      <el-table-column label="项目id" align="center" prop="itemId" />
      <el-table-column label="模型" align="center" prop="model" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="数量" align="center" prop="amount" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="税金" align="center" prop="taxMoney" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户id" align="center" prop="tenandId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['finance:cash-invoice-detail:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['finance:cash-invoice-detail:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="开票信息id" prop="invoice">
          <el-input v-model="form.invoice" placeholder="请输入开票信息id" />
        </el-form-item>
        <el-form-item label="项目" prop="item">
          <el-input v-model="form.item" placeholder="请输入项目" />
        </el-form-item>
        <el-form-item label="项目类型" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择项目类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INVOICE_PRODUCT_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目id" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入项目id" />
        </el-form-item>
        <el-form-item label="模型" prop="model">
          <el-input v-model="form.model" placeholder="请输入模型" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="form.taxRate" placeholder="请输入税率" />
        </el-form-item>
        <el-form-item label="税金" prop="taxMoney">
          <el-input v-model="form.taxMoney" placeholder="请输入税金" />
        </el-form-item>
        <el-form-item label="租户id" prop="tenandId">
          <el-input v-model="form.tenandId" placeholder="请输入租户id" />
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
import { createCashInvoiceDetail, updateCashInvoiceDetail, deleteCashInvoiceDetail, getCashInvoiceDetail, getCashInvoiceDetailPage, exportCashInvoiceDetailExcel } from '@/api/finance/cashInvoiceDetail';

export default {
  name: 'CashInvoiceDetail',
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
      // 财务发票明细列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        invoice: null,
        item: null,
        itemType: null,
        itemId: null,
        model: null,
        unit: null,
        amount: null,
        price: null,
        money: null,
        taxRate: null,
        taxMoney: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        invoice: [{ required: true, message: '开票信息id不能为空', trigger: 'blur' }],
        item: [{ required: true, message: '项目不能为空', trigger: 'blur' }],
        itemType: [{ required: true, message: '项目类型不能为空', trigger: 'change' }],
        itemId: [{ required: true, message: '项目id不能为空', trigger: 'blur' }],
        model: [{ required: true, message: '模型不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        amount: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        money: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        taxRate: [{ required: true, message: '税率不能为空', trigger: 'blur' }],
        taxMoney: [{ required: true, message: '税金不能为空', trigger: 'blur' }],
        tenandId: [{ required: true, message: '租户id不能为空', trigger: 'blur' }],
      },
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
      getCashInvoiceDetailPage(this.queryParams).then(response => {
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
        id: undefined,
        invoice: undefined,
        item: undefined,
        itemType: undefined,
        itemId: undefined,
        model: undefined,
        unit: undefined,
        amount: undefined,
        price: undefined,
        money: undefined,
        taxRate: undefined,
        taxMoney: undefined,
        tenandId: undefined,
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
      this.title = '添加财务发票明细';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCashInvoiceDetail(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改财务发票明细';
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
          updateCashInvoiceDetail(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCashInvoiceDetail(this.form).then(response => {
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
        .confirm('是否确认删除财务发票明细编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCashInvoiceDetail(id);
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
        .confirm('是否确认导出所有财务发票明细数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportCashInvoiceDetailExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '财务发票明细.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
