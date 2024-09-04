<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单流程编码" prop="orderFlowNo" label-width="96">
        <el-input v-model="queryParams.orderFlowNo" placeholder="请输入订单流程编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="明细编码" prop="detailNo">
        <el-input v-model="queryParams.detailNo" placeholder="请输入明细编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="sn" prop="sn">
        <el-input v-model="queryParams.sn" placeholder="请输入sn" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="月份" prop="month">
        <el-select v-model="queryParams.month" placeholder="请选择月份" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_MONTHS)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="账户" prop="account">
        <el-input v-model="queryParams.account" placeholder="请输入账户" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属公司" prop="company">
        <el-input v-model="queryParams.company" placeholder="请输入所属公司" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="部门" prop="dept">
        <el-input v-model="queryParams.dept" placeholder="请输入部门" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="基本工资" prop="basic">
        <el-input v-model="queryParams.basic" placeholder="请输入基本工资" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="绩效" prop="performance">
        <el-input v-model="queryParams.performance" placeholder="请输入绩效" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="红利" prop="bonus">
        <el-input v-model="queryParams.bonus" placeholder="请输入红利" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="津贴" prop="allowance">
        <el-input v-model="queryParams.allowance" placeholder="请输入津贴" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="免税金额" prop="exemption">
        <el-input v-model="queryParams.exemption" placeholder="请输入免税金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="扣减" prop="deduction">
        <el-input v-model="queryParams.deduction" placeholder="请输入扣减" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="奖励" prop="deserved">
        <el-input v-model="queryParams.deserved" placeholder="请输入奖励" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="实际收入" prop="actual">
        <el-input v-model="queryParams.actual" placeholder="请输入实际收入" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="公司SSF" prop="companySsf">
        <el-input v-model="queryParams.companySsf" placeholder="请输入公司SSF" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="公司HPF" prop="companyHpf">
        <el-input v-model="queryParams.companyHpf" placeholder="请输入公司HPF" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="可纳税所得额" prop="curTaxableIncome" label-width="96">
        <el-input v-model="queryParams.curTaxableIncome" placeholder="请输入可纳税所得额" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="应纳税收入" prop="taxableIncome" label-width="82">
        <el-input v-model="queryParams.taxableIncome" placeholder="请输入应纳税收入" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="应付税款" prop="taxPayable">
        <el-input v-model="queryParams.taxPayable" placeholder="请输入应付税款" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="已纳税" prop="taxPaid">
        <el-input v-model="queryParams.taxPaid" placeholder="请输入已纳税" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="税额" prop="tax">
        <el-input v-model="queryParams.tax" placeholder="请输入税额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="queryParams.desc" placeholder="请输入描述" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_STATUS)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
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
          v-hasPermi="['hr:salary:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['hr:salary:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="工资明细id" align="center" prop="id" />
      <el-table-column label="订单流程编码" align="center" prop="orderFlowNo" />
      <el-table-column label="明细编码" align="center" prop="detailNo" />
      <el-table-column label="sn" align="center" prop="sn" />
      <el-table-column label="月份" align="center" prop="month">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.COMMON_MONTHS" :value="scope.row.month" />
        </template>
      </el-table-column>
      <el-table-column label="账户" align="center" prop="account" />
      <el-table-column label="所属公司" align="center" prop="company" />
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="基本工资" align="center" prop="basic" />
      <el-table-column label="绩效" align="center" prop="performance" />
      <el-table-column label="红利" align="center" prop="bonus" />
      <el-table-column label="津贴" align="center" prop="allowance" />
      <el-table-column label="免税金额" align="center" prop="exemption" />
      <el-table-column label="扣减" align="center" prop="deduction" />
      <el-table-column label="奖励" align="center" prop="deserved" />
      <el-table-column label="实际收入" align="center" prop="actual" />
      <el-table-column label="公司SSF" align="center" prop="companySsf" />
      <el-table-column label="公司HPF" align="center" prop="companyHpf" />
      <el-table-column label="可纳税所得额" align="center" prop="curTaxableIncome" />
      <el-table-column label="应纳税收入" align="center" prop="taxableIncome" />
      <el-table-column label="应付税款" align="center" prop="taxPayable" />
      <el-table-column label="已纳税" align="center" prop="taxPaid" />
      <el-table-column label="税额" align="center" prop="tax" />
      <el-table-column label="审核人" align="center" prop="confirmer" />
      <el-table-column label="审核时间" align="center" prop="confirmTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.confirmTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权人" align="center" prop="granter" />
      <el-table-column label="授权时间" align="center" prop="grantTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.grantTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="desc" />
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.WAGE_STATUS" :value="scope.row.status" />
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
            v-hasPermi="['hr:salary:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hr:salary:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单流程编码" prop="orderFlowNo">
          <el-input v-model="form.orderFlowNo" placeholder="请输入订单流程编码" />
        </el-form-item>
        <el-form-item label="明细编码" prop="detailNo">
          <el-input v-model="form.detailNo" placeholder="请输入明细编码" />
        </el-form-item>
        <el-form-item label="sn" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入sn" />
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-select v-model="form.month" placeholder="请选择月份">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_MONTHS)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-model="form.account" placeholder="请输入账户" />
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-input v-model="form.company" placeholder="请输入所属公司" />
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <el-input v-model="form.dept" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="基本工资" prop="basic">
          <el-input v-model="form.basic" placeholder="请输入基本工资" />
        </el-form-item>
        <el-form-item label="绩效" prop="performance">
          <el-input v-model="form.performance" placeholder="请输入绩效" />
        </el-form-item>
        <el-form-item label="红利" prop="bonus">
          <el-input v-model="form.bonus" placeholder="请输入红利" />
        </el-form-item>
        <el-form-item label="津贴" prop="allowance">
          <el-input v-model="form.allowance" placeholder="请输入津贴" />
        </el-form-item>
        <el-form-item label="免税金额" prop="exemption">
          <el-input v-model="form.exemption" placeholder="请输入免税金额" />
        </el-form-item>
        <el-form-item label="扣减" prop="deduction">
          <el-input v-model="form.deduction" placeholder="请输入扣减" />
        </el-form-item>
        <el-form-item label="奖励" prop="deserved">
          <el-input v-model="form.deserved" placeholder="请输入奖励" />
        </el-form-item>
        <el-form-item label="实际收入" prop="actual">
          <el-input v-model="form.actual" placeholder="请输入实际收入" />
        </el-form-item>
        <el-form-item label="公司SSF" prop="companySsf">
          <el-input v-model="form.companySsf" placeholder="请输入公司SSF" />
        </el-form-item>
        <el-form-item label="公司HPF" prop="companyHpf">
          <el-input v-model="form.companyHpf" placeholder="请输入公司HPF" />
        </el-form-item>
        <el-form-item label="可纳税所得额" prop="curTaxableIncome">
          <el-input v-model="form.curTaxableIncome" placeholder="请输入可纳税所得额" />
        </el-form-item>
        <el-form-item label="应纳税收入" prop="taxableIncome">
          <el-input v-model="form.taxableIncome" placeholder="请输入应纳税收入" />
        </el-form-item>
        <el-form-item label="应付税款" prop="taxPayable">
          <el-input v-model="form.taxPayable" placeholder="请输入应付税款" />
        </el-form-item>
        <el-form-item label="已纳税" prop="taxPaid">
          <el-input v-model="form.taxPaid" placeholder="请输入已纳税" />
        </el-form-item>
        <el-form-item label="税额" prop="tax">
          <el-input v-model="form.tax" placeholder="请输入税额" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_STATUS)" :key="dict.value" :label="dict.value">{{
              dict.label }}</el-radio>
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
import { createSalary, updateSalary, deleteSalary, getSalary, getSalaryPage, exportSalaryExcel } from '@/api/hr/salary';

export default {
  name: 'Salary',
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
      // 工资总列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        orderFlowNo: null,
        detailNo: null,
        sn: null,
        month: null,
        account: null,
        company: null,
        dept: null,
        basic: null,
        performance: null,
        bonus: null,
        allowance: null,
        exemption: null,
        deduction: null,
        deserved: null,
        actual: null,
        companySsf: null,
        companyHpf: null,
        curTaxableIncome: null,
        taxableIncome: null,
        taxPayable: null,
        taxPaid: null,
        tax: null,
        desc: null,
        status: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderFlowNo: [{ required: true, message: '订单流程编码不能为空', trigger: 'blur' }],
        detailNo: [{ required: true, message: '明细编码不能为空', trigger: 'blur' }],
        sn: [{ required: true, message: 'sn不能为空', trigger: 'blur' }],
        month: [{ required: true, message: '月份不能为空', trigger: 'change' }],
        account: [{ required: true, message: '账户不能为空', trigger: 'blur' }],
        company: [{ required: true, message: '所属公司不能为空', trigger: 'blur' }],
        dept: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        basic: [{ required: true, message: '基本工资不能为空', trigger: 'blur' }],
        performance: [{ required: true, message: '绩效不能为空', trigger: 'blur' }],
        bonus: [{ required: true, message: '红利不能为空', trigger: 'blur' }],
        allowance: [{ required: true, message: '津贴不能为空', trigger: 'blur' }],
        exemption: [{ required: true, message: '免税金额不能为空', trigger: 'blur' }],
        deduction: [{ required: true, message: '扣减不能为空', trigger: 'blur' }],
        deserved: [{ required: true, message: '奖励不能为空', trigger: 'blur' }],
        actual: [{ required: true, message: '实际收入不能为空', trigger: 'blur' }],
        companySsf: [{ required: true, message: '公司SSF不能为空', trigger: 'blur' }],
        companyHpf: [{ required: true, message: '公司HPF不能为空', trigger: 'blur' }],
        curTaxableIncome: [{ required: true, message: '可纳税所得额不能为空', trigger: 'blur' }],
        taxableIncome: [{ required: true, message: '应纳税收入不能为空', trigger: 'blur' }],
        taxPayable: [{ required: true, message: '应付税款不能为空', trigger: 'blur' }],
        taxPaid: [{ required: true, message: '已纳税不能为空', trigger: 'blur' }],
        tax: [{ required: true, message: '税额不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
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
      getSalaryPage(this.queryParams).then(response => {
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
        orderFlowNo: undefined,
        detailNo: undefined,
        sn: undefined,
        month: undefined,
        account: undefined,
        company: undefined,
        dept: undefined,
        basic: undefined,
        performance: undefined,
        bonus: undefined,
        allowance: undefined,
        exemption: undefined,
        deduction: undefined,
        deserved: undefined,
        actual: undefined,
        companySsf: undefined,
        companyHpf: undefined,
        curTaxableIncome: undefined,
        taxableIncome: undefined,
        taxPayable: undefined,
        taxPaid: undefined,
        tax: undefined,
        desc: undefined,
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
      this.title = '添加工资总';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getSalary(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改工资总';
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
          updateSalary(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createSalary(this.form).then(response => {
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
        .confirm('是否确认删除工资总编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteSalary(id);
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
        .confirm('是否确认导出所有工资总数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportSalaryExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '工资总.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
