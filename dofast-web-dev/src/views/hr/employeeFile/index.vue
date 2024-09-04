<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['hr:employee-file:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['hr:employee-file:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="员工id" align="center" prop="id" />
      <el-table-column label="居民身份证原件正面" align="center" prop="idCardFront" />
      <el-table-column label="居民身份证原件反面" align="center" prop="idCardBack" />
      <el-table-column label="毕业证原件（学历）" align="center" prop="graduationCertificate" />
      <el-table-column label="毕业证原件（学位证书）" align="center" prop="degreeCertificate" />
      <el-table-column label="离职证明(应届生除外)" align="center" prop="resignationCertificate" />
      <el-table-column label="银行储蓄卡" align="center" prop="bankCard" />
      <el-table-column label="白底一寸照" align="center" prop="oneInchPhoto" />
      <el-table-column label="居住登记告知单/居住证" align="center" prop="residencePermit" />
      <el-table-column label="入职承诺书签订（扫描PDF单个上传)" align="center" prop="signingCommitmentLetter" />
      <el-table-column label="专业技术职称原件、职业资格证书原件、上岗证书原件" align="center" prop="qualification" />
      <el-table-column label="社会保险参保证明(应届生除外)" align="center" prop="participationCertificate" />
      <el-table-column label="近三个月三甲医院体检证明" align="center" prop="physicalCertificate" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户id" align="center" prop="tenandId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:employee-file:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:employee-file:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="居民身份证原件正面">
          <imageUpload v-model="form.idCardFront" />
        </el-form-item>
        <el-form-item label="居民身份证原件反面">
          <imageUpload v-model="form.idCardBack" />
        </el-form-item>
        <el-form-item label="毕业证原件（学历）">
          <imageUpload v-model="form.graduationCertificate" />
        </el-form-item>
        <el-form-item label="毕业证原件（学位证书）">
          <imageUpload v-model="form.degreeCertificate" />
        </el-form-item>
        <el-form-item label="离职证明(应届生除外)">
          <imageUpload v-model="form.resignationCertificate" />
        </el-form-item>
        <el-form-item label="银行储蓄卡">
          <imageUpload v-model="form.bankCard" />
        </el-form-item>
        <el-form-item label="白底一寸照">
          <imageUpload v-model="form.oneInchPhoto" />
        </el-form-item>
        <el-form-item label="居住登记告知单/居住证">
          <imageUpload v-model="form.residencePermit" />
        </el-form-item>
        <el-form-item label="入职承诺书签订（扫描PDF单个上传)">
          <imageUpload v-model="form.signingCommitmentLetter" />
        </el-form-item>
        <el-form-item label="专业技术职称原件、职业资格证书原件、上岗证书原件">
          <imageUpload v-model="form.qualification" />
        </el-form-item>
        <el-form-item label="社会保险参保证明(应届生除外)">
          <imageUpload v-model="form.participationCertificate" />
        </el-form-item>
        <el-form-item label="近三个月三甲医院体检证明">
          <imageUpload v-model="form.physicalCertificate" />
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
import { createEmployeeFile, updateEmployeeFile, deleteEmployeeFile, getEmployeeFile, getEmployeeFilePage, exportEmployeeFileExcel } from '@/api/hr/employeeFile';
import ImageUpload from '@/components/ImageUpload';

export default {
  name: 'EmployeeFile',
  components: {
    ImageUpload,
  },
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
      // 员工信息文件列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        createTime: [],
        tenandId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        idCardFront: [{ required: true, message: '居民身份证原件正面不能为空', trigger: 'blur' }],
        idCardBack: [{ required: true, message: '居民身份证原件反面不能为空', trigger: 'blur' }],
        graduationCertificate: [{ required: true, message: '毕业证原件（学历）不能为空', trigger: 'blur' }],
        degreeCertificate: [{ required: true, message: '毕业证原件（学位证书）不能为空', trigger: 'blur' }],
        resignationCertificate: [{ required: true, message: '离职证明(应届生除外)不能为空', trigger: 'blur' }],
        bankCard: [{ required: true, message: '银行储蓄卡不能为空', trigger: 'blur' }],
        oneInchPhoto: [{ required: true, message: '白底一寸照不能为空', trigger: 'blur' }],
        residencePermit: [{ required: true, message: '居住登记告知单/居住证不能为空', trigger: 'blur' }],
        signingCommitmentLetter: [{ required: true, message: '入职承诺书签订（扫描PDF单个上传)不能为空', trigger: 'blur' }],
        qualification: [{ required: true, message: '专业技术职称原件、职业资格证书原件、上岗证书原件不能为空', trigger: 'blur' }],
        participationCertificate: [{ required: true, message: '社会保险参保证明(应届生除外)不能为空', trigger: 'blur' }],
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
      getEmployeeFilePage(this.queryParams).then(response => {
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
        idCardFront: undefined,
        idCardBack: undefined,
        graduationCertificate: undefined,
        degreeCertificate: undefined,
        resignationCertificate: undefined,
        bankCard: undefined,
        oneInchPhoto: undefined,
        residencePermit: undefined,
        signingCommitmentLetter: undefined,
        qualification: undefined,
        participationCertificate: undefined,
        physicalCertificate: undefined,
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
      this.title = '添加员工信息文件';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getEmployeeFile(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改员工信息文件';
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
          updateEmployeeFile(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createEmployeeFile(this.form).then(response => {
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
        .confirm('是否确认删除员工信息文件编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteEmployeeFile(id);
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
        .confirm('是否确认导出所有员工信息文件数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportEmployeeFileExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '员工信息文件.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
