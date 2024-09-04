<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="退款类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择退款类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.CASH_FUND_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="退款父id" prop="parent">
        <el-input v-model="queryParams.parent" placeholder="请输入退款父id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务" prop="trader">
        <el-input v-model="queryParams.trader" placeholder="请输入业务" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同" prop="contract">
        <el-input v-model="queryParams.contract" placeholder="请输入合同" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单" prop="order">
        <el-input v-model="queryParams.order" placeholder="请输入订单" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="批次" prop="batch">
        <el-input v-model="queryParams.batch" placeholder="请输入批次" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="应退金额" prop="deserved">
        <el-input v-model="queryParams.deserved" placeholder="请输入应退金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="实退金额" prop="actual">
        <el-input v-model="queryParams.actual" placeholder="请输入实退金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="余额" prop="balance">
        <el-input v-model="queryParams.balance" placeholder="请输入余额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户" prop="custom">
        <el-select v-model="queryParams.custom" placeholder="请选择客户" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
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
          v-hasPermi="['finance:cash-fund:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['finance:cash-fund:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="退款明细id" align="center" prop="id" />
      <el-table-column label="退款类型" align="center" prop="type">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.CASH_FUND_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="退款原因" align="center" prop="origin" />
      <el-table-column label="退款父id" align="center" prop="parent" />
      <el-table-column label="业务" align="center" prop="trader" />
      <el-table-column label="合同" align="center" prop="contract" />
      <el-table-column label="订单" align="center" prop="order" />
      <el-table-column label="批次" align="center" prop="batch" />
      <el-table-column label="应退金额" align="center" prop="deserved" />
      <el-table-column label="实退金额" align="center" prop="actual" />
      <el-table-column label="余额" align="center" prop="balance" />
      <el-table-column label="客户" align="center" prop="custom">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.custom" />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="desc" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户id" align="center" prop="tenandId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['finance:cash-fund:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['finance:cash-fund:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="退款类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择退款类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.CASH_FUND_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="退款原因" prop="origin">
          <el-input v-model="form.origin" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="退款父id" prop="parent">
          <el-input v-model="form.parent" placeholder="请输入退款父id" />
        </el-form-item>
        <el-form-item label="业务" prop="trader">
          <el-input v-model="form.trader" placeholder="请输入业务" />
        </el-form-item>
        <el-form-item label="合同" prop="contract">
          <el-input v-model="form.contract" placeholder="请输入合同" />
        </el-form-item>
        <el-form-item label="订单" prop="order">
          <el-input v-model="form.order" placeholder="请输入订单" />
        </el-form-item>
        <el-form-item label="批次" prop="batch">
          <el-input v-model="form.batch" placeholder="请输入批次" />
        </el-form-item>
        <el-form-item label="应退金额" prop="deserved">
          <el-input v-model="form.deserved" placeholder="请输入应退金额" />
        </el-form-item>
        <el-form-item label="实退金额" prop="actual">
          <el-input v-model="form.actual" placeholder="请输入实退金额" />
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入余额" />
        </el-form-item>
        <el-form-item label="客户" prop="custom">
          <el-radio-group v-model="form.custom">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
              :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" placeholder="请输入内容" />
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
import { createCashFund, updateCashFund, deleteCashFund, getCashFund, getCashFundPage, exportCashFundExcel } from '@/api/finance/cashFund';

export default {
  name: 'CashFund',
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
      // 财务退款列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        type: null,
        origin: null,
        parent: null,
        trader: null,
        contract: null,
        order: null,
        batch: null,
        deserved: null,
        actual: null,
        balance: null,
        custom: null,
        desc: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [{ required: true, message: '退款类型不能为空', trigger: 'change' }],
        origin: [{ required: true, message: '退款原因不能为空', trigger: 'blur' }],
        parent: [{ required: true, message: '退款父id不能为空', trigger: 'blur' }],
        trader: [{ required: true, message: '业务不能为空', trigger: 'blur' }],
        contract: [{ required: true, message: '合同不能为空', trigger: 'blur' }],
        order: [{ required: true, message: '订单不能为空', trigger: 'blur' }],
        batch: [{ required: true, message: '批次不能为空', trigger: 'blur' }],
        deserved: [{ required: true, message: '应退金额不能为空', trigger: 'blur' }],
        actual: [{ required: true, message: '实退金额不能为空', trigger: 'blur' }],
        balance: [{ required: true, message: '余额不能为空', trigger: 'blur' }],
        custom: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
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
      getCashFundPage(this.queryParams).then(response => {
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
        type: undefined,
        origin: undefined,
        parent: undefined,
        trader: undefined,
        contract: undefined,
        order: undefined,
        batch: undefined,
        deserved: undefined,
        actual: undefined,
        balance: undefined,
        custom: undefined,
        desc: undefined,
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
      this.title = '添加财务退款';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCashFund(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改财务退款';
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
          updateCashFund(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCashFund(this.form).then(response => {
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
        .confirm('是否确认删除财务退款编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCashFund(id);
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
        .confirm('是否确认导出所有财务退款数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportCashFundExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '财务退款.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
