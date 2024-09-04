<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学校" prop="educationSchool">
        <el-input v-model="queryParams.educationSchool" placeholder="请输入学校" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="专业" prop="educationSpecialty">
        <el-input v-model="queryParams.educationSpecialty" placeholder="请输入专业" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所获荣誉" prop="educationHonor">
        <el-input v-model="queryParams.educationHonor" placeholder="请输入所获荣誉" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="教育开始时间" prop="educationStarttime">
        <el-date-picker v-model="queryParams.educationStarttime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item label="教育结束时间" prop="educationEndtime">
        <el-date-picker v-model="queryParams.educationEndtime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['hr:employee-education:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['hr:employee-education:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="培训教育经历id" align="center" prop="educationId" />
      <el-table-column label="学校" align="center" prop="educationSchool" />
      <el-table-column label="专业" align="center" prop="educationSpecialty" />
      <el-table-column label="所获荣誉" align="center" prop="educationHonor" />
      <el-table-column label="教育开始时间" align="center" prop="educationStarttime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.educationStarttime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教育结束时间" align="center" prop="educationEndtime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.educationEndtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户id" align="center" prop="tenandId" />
      <el-table-column label="培训教育经历id" align="center" prop="id" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:employee-education:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:employee-education:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校" prop="educationSchool">
          <el-input v-model="form.educationSchool" placeholder="请输入学校" />
        </el-form-item>
        <el-form-item label="专业" prop="educationSpecialty">
          <el-input v-model="form.educationSpecialty" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="所获荣誉" prop="educationHonor">
          <el-input v-model="form.educationHonor" placeholder="请输入所获荣誉" />
        </el-form-item>
        <el-form-item label="教育开始时间" prop="educationStarttime">
          <el-date-picker clearable v-model="form.educationStarttime" type="date" value-format="timestamp" placeholder="选择教育开始时间" />
        </el-form-item>
        <el-form-item label="教育结束时间" prop="educationEndtime">
          <el-date-picker clearable v-model="form.educationEndtime" type="date" value-format="timestamp" placeholder="选择教育结束时间" />
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
import { createEmployeeEducation, updateEmployeeEducation, deleteEmployeeEducation, getEmployeeEducation, getEmployeeEducationPage, exportEmployeeEducationExcel } from '@/api/hr/employeeEducation';

export default {
  name: 'EmployeeEducation',
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
      // 员工教育培训经历列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        educationSchool: null,
        educationSpecialty: null,
        educationHonor: null,
        educationStarttime: [],
        educationEndtime: [],
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        educationSchool: [{ required: true, message: '学校不能为空', trigger: 'blur' }],
        educationSpecialty: [{ required: true, message: '专业不能为空', trigger: 'blur' }],
        educationHonor: [{ required: true, message: '所获荣誉不能为空', trigger: 'blur' }],
        educationStarttime: [{ required: true, message: '教育开始时间不能为空', trigger: 'blur' }],
        educationEndtime: [{ required: true, message: '教育结束时间不能为空', trigger: 'blur' }],
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
      getEmployeeEducationPage(this.queryParams).then(response => {
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
        educationId: undefined,
        educationSchool: undefined,
        educationSpecialty: undefined,
        educationHonor: undefined,
        educationStarttime: undefined,
        educationEndtime: undefined,
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
      this.title = '添加员工教育培训经历';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const educationId = row.educationId;
      getEmployeeEducation(educationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改员工教育培训经历';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.educationId != null) {
          updateEmployeeEducation(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createEmployeeEducation(this.form).then(response => {
          this.$modal.msgSuccess('新增成功');
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const educationId = row.educationId;
      this.$modal
        .confirm('是否确认删除员工教育培训经历编号为"' + educationId + '"的数据项?')
        .then(function () {
          return deleteEmployeeEducation(educationId);
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
        .confirm('是否确认导出所有员工教育培训经历数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportEmployeeEducationExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '员工教育培训经历.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
