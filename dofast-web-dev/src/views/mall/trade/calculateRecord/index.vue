<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="typeId">
        <el-input v-model="queryParams.typeId" placeholder="请输入类型" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="结果" prop="result">
        <el-input v-model="queryParams.result" placeholder="请输入结果" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="操作系统" prop="os">
        <el-input v-model="queryParams.os" placeholder="请输入操作系统" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户端" prop="client">
        <el-input v-model="queryParams.client" placeholder="请输入客户端" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="设备信息" prop="device">
        <el-input v-model="queryParams.device" placeholder="请输入设备信息" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['trade:calculate-record:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['trade:calculate-record:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="数据" align="center" prop="recordId" />
      <el-table-column label="类型" align="center" prop="typeId" />
      <el-table-column label="结果" align="center" prop="result" />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column label="客户端" align="center" prop="client" />
      <el-table-column label="设备信息" align="center" prop="device" />
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['trade:calculate-record:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['trade:calculate-record:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="数据" prop="recordId">
          <el-input v-model="form.recordId" placeholder="请输入数据" />
        </el-form-item>
        <el-form-item label="类型" prop="typeId">
          <el-input v-model="form.typeId" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-input v-model="form.result" placeholder="请输入结果" />
        </el-form-item>
        <el-form-item label="操作系统" prop="os">
          <el-input v-model="form.os" placeholder="请输入操作系统" />
        </el-form-item>
        <el-form-item label="客户端" prop="client">
          <el-input v-model="form.client" placeholder="请输入客户端" />
        </el-form-item>
        <el-form-item label="设备信息" prop="device">
          <el-input v-model="form.device" placeholder="请输入设备信息" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { createCalculateRecord, updateCalculateRecord, deleteCalculateRecord, getCalculateRecord, getCalculateRecordPage, exportCalculateRecordExcel } from '@/api/mall/trade/calculateRecord';

export default {
  name: 'CalculateRecord',
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
      // 计价记录列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        typeId: null,
        result: null,
        os: null,
        client: null,
        device: null,
        mobile: null,
        remark: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recordId: [{ required: true, message: '数据不能为空', trigger: 'blur' }],
        typeId: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        result: [{ required: true, message: '结果不能为空', trigger: 'blur' }],
        os: [{ required: true, message: '操作系统不能为空', trigger: 'blur' }],
        client: [{ required: true, message: '客户端不能为空', trigger: 'blur' }],
        device: [{ required: true, message: '设备信息不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
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
      getCalculateRecordPage(this.queryParams).then(response => {
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
        recordId: undefined,
        typeId: undefined,
        result: undefined,
        os: undefined,
        client: undefined,
        device: undefined,
        mobile: undefined,
        remark: undefined,
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
      this.title = '添加计价记录';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getCalculateRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改计价记录';
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
          updateCalculateRecord(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCalculateRecord(this.form).then(response => {
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
        .confirm('是否确认删除计价记录编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteCalculateRecord(id);
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
        .confirm('是否确认导出所有计价记录数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportCalculateRecordExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '计价记录.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
