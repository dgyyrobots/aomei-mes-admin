<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="从业公司" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入从业公司" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="从业薪资" prop="treatment">
        <el-input v-model="queryParams.treatment" placeholder="请输入从业薪资" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="担任职位" prop="treatmentPost">
        <el-input v-model="queryParams.treatmentPost" placeholder="请输入担任职位" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="离职原因" prop="reasonForLeave">
        <el-input v-model="queryParams.reasonForLeave" placeholder="请输入离职原因" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="租户id" prop="tenandId">
        <el-input v-model="queryParams.tenandId" placeholder="请输入租户id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['hr:employee-workhistory:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['hr:employee-workhistory:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="员工id" align="center" prop="employeeId" />
      <el-table-column label="从业公司" align="center" prop="companyName" />
      <el-table-column label="从业薪资" align="center" prop="treatment" />
      <el-table-column label="担任职位" align="center" prop="treatmentPost" />
      <el-table-column label="离职原因" align="center" prop="reasonForLeave" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户id" align="center" prop="tenandId" />
      <el-table-column label="员工id" align="center" prop="id" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:employee-workhistory:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:employee-workhistory:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="从业公司" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入从业公司" />
        </el-form-item>
        <el-form-item label="从业薪资" prop="treatment">
          <el-input v-model="form.treatment" placeholder="请输入从业薪资" />
        </el-form-item>
        <el-form-item label="担任职位" prop="treatmentPost">
          <el-input v-model="form.treatmentPost" placeholder="请输入担任职位" />
        </el-form-item>
        <el-form-item label="离职原因" prop="reasonForLeave">
          <el-input v-model="form.reasonForLeave" placeholder="请输入离职原因" />
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
import { createEmployeeWorkhistory, updateEmployeeWorkhistory, deleteEmployeeWorkhistory, getEmployeeWorkhistory, getEmployeeWorkhistoryPage, exportEmployeeWorkhistoryExcel } from '@/api/hr/employeeWorkhistory';

export default {
  name: 'EmployeeWorkhistory',
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
      // 员工工作经历列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        companyName: null,
        treatment: null,
        treatmentPost: null,
        reasonForLeave: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyName: [{ required: true, message: '从业公司不能为空', trigger: 'blur' }],
        treatment: [{ required: true, message: '从业薪资不能为空', trigger: 'blur' }],
        treatmentPost: [{ required: true, message: '担任职位不能为空', trigger: 'blur' }],
        reasonForLeave: [{ required: true, message: '离职原因不能为空', trigger: 'blur' }],
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
      getEmployeeWorkhistoryPage(this.queryParams).then(response => {
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
        employeeId: undefined,
        companyName: undefined,
        treatment: undefined,
        treatmentPost: undefined,
        reasonForLeave: undefined,
        tenandId: undefined,
        id: undefined,
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
      this.title = '添加员工工作经历';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const employeeId = row.employeeId;
      getEmployeeWorkhistory(employeeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改员工工作经历';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.employeeId != null) {
          updateEmployeeWorkhistory(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createEmployeeWorkhistory(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const employeeId = row.employeeId;
      this.$modal
        .confirm('是否确认删除员工工作经历编号为"' + employeeId + '"的数据项?')
        .then(function () {
          return deleteEmployeeWorkhistory(employeeId);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams };
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal
        .confirm('是否确认导出所有员工工作经历数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportEmployeeWorkhistoryExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '员工工作经历.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
