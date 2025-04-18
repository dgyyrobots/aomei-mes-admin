<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工资" prop="salary">
        <el-input v-model="queryParams.salary" placeholder="请输入工资" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="科目" prop="item">
        <el-select v-model="queryParams.item" placeholder="请选择科目" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.HR_SALARY_ITEM)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input v-model="queryParams.amount" placeholder="请输入金额" clearable @keyup.enter.native="handleQuery" />
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
          v-hasPermi="['hr:salarydetail:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
          v-hasPermi="['hr:salarydetail:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="工资明细id" align="center" prop="id" />
      <el-table-column label="工资" align="center" prop="salary" />
      <el-table-column label="科目" align="center" prop="item">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.HR_SALARY_ITEM" :value="scope.row.item" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.WAGE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="amount" />
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
            v-hasPermi="['hr:salarydetail:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hr:salarydetail:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工资" prop="salary">
          <el-input v-model="form.salary" placeholder="请输入工资" />
        </el-form-item>
        <el-form-item label="科目" prop="item">
          <el-select v-model="form.item" placeholder="请选择科目">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.HR_SALARY_ITEM)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option v-for="dict in this.getDictDatas(DICT_TYPE.WAGE_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额" />
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
import { createSalarydetail, updateSalarydetail, deleteSalarydetail, getSalarydetail, getSalarydetailPage, exportSalarydetailExcel } from '@/api/hr/salarydetail';

export default {
  name: 'Salarydetail',
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
      // 工资明细列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        salary: null,
        item: null,
        type: null,
        amount: null,
        desc: null,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        salary: [{ required: true, message: '工资不能为空', trigger: 'blur' }],
        item: [{ required: true, message: '科目不能为空', trigger: 'change' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
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
      getSalarydetailPage(this.queryParams).then(response => {
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
        salary: undefined,
        item: undefined,
        type: undefined,
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
      this.title = '添加工资明细';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getSalarydetail(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改工资明细';
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
          updateSalarydetail(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createSalarydetail(this.form).then(response => {
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
        .confirm('是否确认删除工资明细编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteSalarydetail(id);
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
        .confirm('是否确认导出所有工资明细数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportSalarydetailExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '工资明细.xls');
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
