<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="账户类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择账户类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.CASH_DEPOSITOR_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="简称" prop="abbr">
        <el-input v-model="queryParams.abbr" placeholder="请输入简称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="账户名称" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入账户名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="账户标签" prop="tags">
        <el-input v-model="queryParams.tags" placeholder="请输入账户标签" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应者" prop="provider">
        <el-input v-model="queryParams.provider" placeholder="请输入供应者" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开户银行" prop="bank">
        <el-input v-model="queryParams.bank" placeholder="请输入开户银行" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户编码" prop="customerNo">
        <el-input v-model="queryParams.customerNo" placeholder="请输入客户编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="银行账号" prop="account">
        <el-input v-model="queryParams.account" placeholder="请输入银行账号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联合银行编码" prop="unionBankNo" label-width="96">
        <el-input v-model="queryParams.unionBankNo" placeholder="请输入联合银行编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="清算银行编码" prop="clearingBankNo" label-width="96">
        <el-input v-model="queryParams.clearingBankNo" placeholder="请输入清算银行编码" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否公开" prop="isPublic">
        <el-select v-model="queryParams.isPublic" placeholder="请选择是否公开" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="当前余额" prop="currency">
        <el-input v-model="queryParams.currency" placeholder="请输入当前余额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.CASH_DEPOSITOR_STATUS)" :key="dict.value"
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
          v-hasPermi="['finance:cash-depositor:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['finance:cash-depositor:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="资金账户id" align="center" prop="id" />
      <el-table-column label="账户类型" align="center" prop="type">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.CASH_DEPOSITOR_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="简称" align="center" prop="abbr" />
      <el-table-column label="账户名称" align="center" prop="title" />
      <el-table-column label="账户标签" align="center" prop="tags" />
      <el-table-column label="供应者" align="center" prop="provider" />
      <el-table-column label="开户银行" align="center" prop="bank" />
      <el-table-column label="客户编码" align="center" prop="customerNo" />
      <el-table-column label="银行账号" align="center" prop="account" />
      <el-table-column label="联合银行编码" align="center" prop="unionBankNo" />
      <el-table-column label="清算银行编码" align="center" prop="clearingBankNo" />
      <el-table-column label="是否公开" align="center" prop="public">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.public" />
        </template>
      </el-table-column>
      <el-table-column label="当前余额" align="center" prop="currency" />
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.CASH_DEPOSITOR_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户id" align="center" prop="tenandId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['finance:cash-depositor:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['finance:cash-depositor:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账户类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择账户类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.CASH_DEPOSITOR_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="简称" prop="abbr">
          <el-input v-model="form.abbr" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="账户名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入账户名称" />
        </el-form-item>
        <el-form-item label="账户标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入账户标签" />
        </el-form-item>
        <el-form-item label="供应者" prop="provider">
          <el-input v-model="form.provider" placeholder="请输入供应者" />
        </el-form-item>
        <el-form-item label="开户银行" prop="bank">
          <el-input v-model="form.bank" placeholder="请输入开户银行" />
        </el-form-item>
        <el-form-item label="客户编码" prop="customerNo">
          <el-input v-model="form.customerNo" placeholder="请输入客户编码" />
        </el-form-item>
        <el-form-item label="银行账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入银行账号" />
        </el-form-item>
        <el-form-item label="联合银行编码" prop="unionBankNo">
          <el-input v-model="form.unionBankNo" placeholder="请输入联合银行编码" />
        </el-form-item>
        <el-form-item label="清算银行编码" prop="clearingBankNo">
          <el-input v-model="form.clearingBankNo" placeholder="请输入清算银行编码" />
        </el-form-item>
        <el-form-item label="是否公开" prop="isPublic">
          <el-radio-group v-model="form.isPublic">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
              :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前余额" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入当前余额" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.CASH_DEPOSITOR_STATUS)" :key="dict.value"
              :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
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
import { createCashDepositor, updateCashDepositor, deleteCashDepositor, getCashDepositor, getCashDepositorPage, exportCashDepositorExcel } from '@/api/finance/cashDepositor';

export default {
  name: 'CashDepositor',
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
      // 资金账号列表
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
        abbr: null,
        title: null,
        tags: null,
        provider: null,
        bank: null,
        customerNo: null,
        account: null,
        unionBankNo: null,
        clearingBankNo: null,
        public: null,
        currency: null,
        status: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [{ required: true, message: '账户类型不能为空', trigger: 'change' }],
        abbr: [{ required: true, message: '简称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '账户名称不能为空', trigger: 'blur' }],
        tags: [{ required: true, message: '账户标签不能为空', trigger: 'blur' }],
        provider: [{ required: true, message: '供应者不能为空', trigger: 'blur' }],
        bank: [{ required: true, message: '开户银行不能为空', trigger: 'blur' }],
        customerNo: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '银行账号不能为空', trigger: 'blur' }],
        unionBankNo: [{ required: true, message: '联合银行编码不能为空', trigger: 'blur' }],
        clearingBankNo: [{ required: true, message: '清算银行编码不能为空', trigger: 'blur' }],
        isPublic: [{ required: true, message: '是否公开不能为空', trigger: 'blur' }],
        currency: [{ required: true, message: '当前余额不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
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
      getCashDepositorPage(this.queryParams).then(response => {
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
        abbr: undefined,
        title: undefined,
        tags: undefined,
        provider: undefined,
        bank: undefined,
        customerNo: undefined,
        account: undefined,
        unionBankNo: undefined,
        clearingBankNo: undefined,
        public: undefined,
        currency: undefined,
        status: undefined,
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
      this.title = '添加资金账号';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCashDepositor(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改资金账号';
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
          updateCashDepositor(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCashDepositor(this.form).then(response => {
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
        .confirm('是否确认删除资金账号编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCashDepositor(id);
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
        .confirm('是否确认导出所有资金账号数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportCashDepositorExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '资金账号.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
