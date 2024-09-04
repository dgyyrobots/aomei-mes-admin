<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="供应者" prop="depositor">
        <el-input v-model="queryParams.depositor" placeholder="请输入供应者" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="父账号" prop="parent">
        <el-input v-model="queryParams.parent" placeholder="请输入父账号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品" prop="product">
        <el-input v-model="queryParams.product" placeholder="请输入产品" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="交易人" prop="trader">
        <el-input v-model="queryParams.trader" placeholder="请输入交易人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单" prop="order">
        <el-input v-model="queryParams.order" placeholder="请输入订单" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同" prop="contract">
        <el-input v-model="queryParams.contract" placeholder="请输入合同" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="关联类型" prop="relatedType">
        <el-select v-model="queryParams.relatedType" placeholder="请选择关联类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.FINANCE_FLOW_RELATION_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="关联id" prop="relatedId">
        <el-input v-model="queryParams.relatedId" placeholder="请输入关联id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="项目" prop="project">
        <el-input v-model="queryParams.project" placeholder="请输入项目" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="投资" prop="investId">
        <el-input v-model="queryParams.investId" placeholder="请输入投资" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="贷款" prop="loanId">
        <el-input v-model="queryParams.loanId" placeholder="请输入贷款" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="转账" prop="transferId">
        <el-input v-model="queryParams.transferId" placeholder="请输入转账" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="部门" prop="dept">
        <el-input v-model="queryParams.dept" placeholder="请输入部门" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.FINANCE_FLOW_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="money">
        <el-input v-model="queryParams.money" placeholder="请输入金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="汇率" prop="exchangeRate">
        <el-input v-model="queryParams.exchangeRate" placeholder="请输入汇率" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="当前额度" prop="currency">
        <el-input v-model="queryParams.currency" placeholder="请输入当前额度" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="queryParams.date" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker v-model="queryParams.time" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="最后期限" prop="deadline">
        <el-date-picker clearable v-model="queryParams.deadline" type="date" value-format="timestamp"
          placeholder="选择最后期限" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择分类" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.FINANCE_FLOW_CATEGORY)" :key="dict.value"
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
          v-hasPermi="['finance:cash-trade:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['finance:cash-trade:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="资金明细id" align="center" prop="id" />
      <el-table-column label="供应者" align="center" prop="depositor" />
      <el-table-column label="父账号" align="center" prop="parent" />
      <el-table-column label="产品" align="center" prop="product" />
      <el-table-column label="交易人" align="center" prop="trader" />
      <el-table-column label="订单" align="center" prop="order" />
      <el-table-column label="合同" align="center" prop="contract" />
      <el-table-column label="关联类型" align="center" prop="relatedType">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.FINANCE_FLOW_RELATION_TYPE" :value="scope.row.relatedType" />
        </template>
      </el-table-column>
      <el-table-column label="关联id" align="center" prop="relatedId" />
      <el-table-column label="项目" align="center" prop="project" />
      <el-table-column label="投资" align="center" prop="investId" />
      <el-table-column label="贷款" align="center" prop="loanId" />
      <el-table-column label="转账" align="center" prop="transferId" />
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="类型" align="center" prop="type">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.FINANCE_FLOW_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="汇率" align="center" prop="exchangeRate" />
      <el-table-column label="当前额度" align="center" prop="currency" />
      <el-table-column label="日期" align="center" prop="date" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="time" />
      <el-table-column label="最后期限" align="center" prop="deadline" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.deadline) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="category">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.FINANCE_FLOW_CATEGORY" :value="scope.row.category" />
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
            v-hasPermi="['finance:cash-trade:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['finance:cash-trade:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="供应者" prop="depositor">
          <el-input v-model="form.depositor" placeholder="请输入供应者" />
        </el-form-item>
        <el-form-item label="父账号" prop="parent">
          <el-input v-model="form.parent" placeholder="请输入父账号" />
        </el-form-item>
        <el-form-item label="产品" prop="product">
          <el-input v-model="form.product" placeholder="请输入产品" />
        </el-form-item>
        <el-form-item label="交易人" prop="trader">
          <el-input v-model="form.trader" placeholder="请输入交易人" />
        </el-form-item>
        <el-form-item label="订单" prop="order">
          <el-input v-model="form.order" placeholder="请输入订单" />
        </el-form-item>
        <el-form-item label="合同" prop="contract">
          <el-input v-model="form.contract" placeholder="请输入合同" />
        </el-form-item>
        <el-form-item label="关联类型" prop="relatedType">
          <el-select v-model="form.relatedType" placeholder="请选择关联类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.FINANCE_FLOW_RELATION_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联id" prop="relatedId">
          <el-input v-model="form.relatedId" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="项目" prop="project">
          <el-input v-model="form.project" placeholder="请输入项目" />
        </el-form-item>
        <el-form-item label="投资" prop="investId">
          <el-input v-model="form.investId" placeholder="请输入投资" />
        </el-form-item>
        <el-form-item label="贷款" prop="loanId">
          <el-input v-model="form.loanId" placeholder="请输入贷款" />
        </el-form-item>
        <el-form-item label="转账" prop="transferId">
          <el-input v-model="form.transferId" placeholder="请输入转账" />
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <el-input v-model="form.dept" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.FINANCE_FLOW_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input v-model="form.exchangeRate" placeholder="请输入汇率" />
        </el-form-item>
        <el-form-item label="当前额度" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入当前额度" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker clearable v-model="form.date" type="date" value-format="timestamp" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker clearable v-model="form.time" type="date" value-format="timestamp" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="最后期限" prop="deadline">
          <el-date-picker clearable v-model="form.deadline" type="date" value-format="timestamp" placeholder="选择最后期限" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.FINANCE_FLOW_CATEGORY)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
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
import { createCashTrade, updateCashTrade, deleteCashTrade, getCashTrade, getCashTradePage, exportCashTradeExcel } from '@/api/finance/cashTrade';

export default {
  name: 'CashTrade',
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
      // 财务流水列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        depositor: null,
        parent: null,
        product: null,
        trader: null,
        order: null,
        contract: null,
        relatedType: null,
        relatedId: null,
        project: null,
        investId: null,
        loanId: null,
        transferId: null,
        dept: null,
        type: null,
        money: null,
        exchangeRate: null,
        currency: null,
        date: [],
        time: [],
        deadline: null,
        deadline: [],
        category: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        depositor: [{ required: true, message: '供应者不能为空', trigger: 'blur' }],
        parent: [{ required: true, message: '父账号不能为空', trigger: 'blur' }],
        product: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
        trader: [{ required: true, message: '交易人不能为空', trigger: 'blur' }],
        order: [{ required: true, message: '订单不能为空', trigger: 'blur' }],
        contract: [{ required: true, message: '合同不能为空', trigger: 'blur' }],
        relatedType: [{ required: true, message: '关联类型不能为空', trigger: 'change' }],
        relatedId: [{ required: true, message: '关联id不能为空', trigger: 'blur' }],
        project: [{ required: true, message: '项目不能为空', trigger: 'blur' }],
        investId: [{ required: true, message: '投资不能为空', trigger: 'blur' }],
        loanId: [{ required: true, message: '贷款不能为空', trigger: 'blur' }],
        transferId: [{ required: true, message: '转账不能为空', trigger: 'blur' }],
        dept: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        money: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        exchangeRate: [{ required: true, message: '汇率不能为空', trigger: 'blur' }],
        currency: [{ required: true, message: '当前额度不能为空', trigger: 'blur' }],
        date: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
        time: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
        deadline: [{ required: true, message: '最后期限不能为空', trigger: 'blur' }],
        category: [{ required: true, message: '分类不能为空', trigger: 'change' }],
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
      getCashTradePage(this.queryParams).then(response => {
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
        depositor: undefined,
        parent: undefined,
        product: undefined,
        trader: undefined,
        order: undefined,
        contract: undefined,
        relatedType: undefined,
        relatedId: undefined,
        project: undefined,
        investId: undefined,
        loanId: undefined,
        transferId: undefined,
        dept: undefined,
        type: undefined,
        money: undefined,
        exchangeRate: undefined,
        currency: undefined,
        date: undefined,
        time: undefined,
        deadline: undefined,
        category: undefined,
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
      this.title = '添加财务流水';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCashTrade(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改财务流水';
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
          updateCashTrade(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCashTrade(this.form).then(response => {
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
        .confirm('是否确认删除财务流水编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCashTrade(id);
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
        .confirm('是否确认导出所有财务流水数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportCashTradeExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '财务流水.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
