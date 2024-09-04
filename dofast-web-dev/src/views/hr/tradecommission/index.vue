<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="提成类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择提成类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="科目类型" prop="signType">
        <el-select v-model="queryParams.signType" placeholder="请选择科目类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.HR_SALARY_ITEM)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型" prop="saleType">
        <el-select v-model="queryParams.saleType" placeholder="请选择产品类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PRODUCT_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务" prop="trade">
        <el-select v-model="queryParams.trade" placeholder="请选择业务" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_BUSINESS_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="queryParams.account" placeholder="请输入账号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业绩额度" prop="contribution">
        <el-input v-model="queryParams.contribution" placeholder="请输入业绩额度" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="提成比例" prop="rate">
        <el-input v-model="queryParams.rate" placeholder="请输入提成比例" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="提成金额" prop="amount">
        <el-input v-model="queryParams.amount" placeholder="请输入提成金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="queryParams.desc" placeholder="请输入描述" clearable @keyup.enter.native="handleQuery" />
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
          v-hasPermi="['hr:tradecommission:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['hr:tradecommission:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="提成明细id" align="center" prop="id" />
      <el-table-column label="提成类型" align="center" prop="type">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.WAGE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="科目类型" align="center" prop="signType">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.HR_SALARY_ITEM" :value="scope.row.signType" />
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center" prop="saleType">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.PRODUCT_TYPE" :value="scope.row.saleType" />
        </template>
      </el-table-column>
      <el-table-column label="业务" align="center" prop="trade">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.WAGE_BUSINESS_TYPE" :value="scope.row.trade" />
        </template>
      </el-table-column>
      <el-table-column label="合同" align="center" prop="contract" />
      <el-table-column label="账号" align="center" prop="account" />
      <el-table-column label="业绩额度" align="center" prop="contribution" />
      <el-table-column label="提成比例" align="center" prop="rate" />
      <el-table-column label="提成金额" align="center" prop="amount" />
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
            v-hasPermi="['hr:tradecommission:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hr:tradecommission:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="提成类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择提成类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目类型" prop="signType">
          <el-select v-model="form.signType" placeholder="请选择科目类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.HR_SALARY_ITEM)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="saleType">
          <el-select v-model="form.saleType" placeholder="请选择产品类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.PRODUCT_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务" prop="trade">
          <el-select v-model="form.trade" placeholder="请选择业务">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_BUSINESS_TYPE)" :key="dict.value"
              :label="dict.label" :value="parseInt(dict.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="业绩额度" prop="contribution">
          <el-input v-model="form.contribution" placeholder="请输入业绩额度" />
        </el-form-item>
        <el-form-item label="提成比例" prop="rate">
          <el-input v-model="form.rate" placeholder="请输入提成比例" />
        </el-form-item>
        <el-form-item label="提成金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入提成金额" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入描述" />
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
import { createTradecommission, updateTradecommission, deleteTradecommission, getTradecommission, getTradecommissionPage, exportTradecommissionExcel } from '@/api/hr/tradecommission';

export default {
  name: 'Tradecommission',
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
      // 工资提成列表
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
        signType: null,
        saleType: null,
        trade: null,
        account: null,
        contribution: null,
        rate: null,
        amount: null,
        desc: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [{ required: true, message: '提成类型不能为空', trigger: 'change' }],
        signType: [{ required: true, message: '科目类型不能为空', trigger: 'change' }],
        saleType: [{ required: true, message: '产品类型不能为空', trigger: 'change' }],
        trade: [{ required: true, message: '业务不能为空', trigger: 'change' }],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        contribution: [{ required: true, message: '业绩额度不能为空', trigger: 'blur' }],
        rate: [{ required: true, message: '提成比例不能为空', trigger: 'blur' }],
        amount: [{ required: true, message: '提成金额不能为空', trigger: 'blur' }],
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
      getTradecommissionPage(this.queryParams).then(response => {
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
        signType: undefined,
        saleType: undefined,
        trade: undefined,
        account: undefined,
        contribution: undefined,
        rate: undefined,
        amount: undefined,
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
      this.title = '添加工资提成';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getTradecommission(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改工资提成';
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
          updateTradecommission(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createTradecommission(this.form).then(response => {
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
        .confirm('是否确认删除工资提成编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteTradecommission(id);
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
        .confirm('是否确认导出所有工资提成数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportTradecommissionExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '工资提成.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
