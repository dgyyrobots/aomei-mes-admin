<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物流公司名称" prop="name" label-width="100px">
        <el-input v-model="queryParams.name" placeholder="请输入物流公司名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否支持电子面单" prop="supportElectronicSheet" label-width="125px">
        <el-select v-model="queryParams.supportElectronicSheet" placeholder="请选择是否支持电子面单（0不支持  1支持）" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="打印风格" prop="printStyle">
        <el-input v-model="queryParams.printStyle" placeholder="请输入打印风格" clearable @keyup.enter.native="handleQuery" />
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:express-company:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:express-company:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="物流公司编号" align="center" prop="id" />
      <el-table-column label="物流公司名称" align="center" prop="name" />
      <el-table-column label="物流公司logo" align="center" prop="logo" />
      <el-table-column label="物流公司网址" align="center" prop="url" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="是否支持电子面单" align="center" prop="supportElectronicSheet">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.supportElectronicSheet" />
        </template>
      </el-table-column>
      <el-table-column label="电子面单打印风格" align="center" prop="printStyle" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:express-company:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:express-company:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="物流公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入物流公司名称" />
        </el-form-item>
        <el-form-item label="物流公司logo">
          <imageUpload v-model="form.logo" />
        </el-form-item>
        <el-form-item label="物流公司网址" prop="url">
          <el-input v-model="form.url" placeholder="请输入物流公司网址" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="快递鸟" prop="kdBirdNo">
          <el-input v-model="form.kdBirdNo" placeholder="请输入编码（快递鸟）" />
        </el-form-item>
        <el-form-item label="快递100编码" prop="kd100No">
          <el-input v-model="form.kd100No" placeholder="请输入编码（快递100）" />
        </el-form-item>
        <el-form-item label="快递100免费版编码" prop="kd100NoFree">
          <el-input v-model="form.kd100NoFree" placeholder="请输入编码（快递100免费版）" />
        </el-form-item>
        <el-form-item label="菜鸟编码" prop="cainiaoNo">
          <el-input v-model="form.cainiaoNo" placeholder="请输入编码（菜鸟）" />
        </el-form-item>
        <el-form-item label="快递查询编码" prop="extNo">
          <el-input v-model="form.extNo" placeholder="请输入编码（快递查询接口）" />
        </el-form-item>
        <el-form-item label="是否支持电子面单" prop="supportElectronicSheet">
          <el-radio-group v-model="form.supportElectronicSheet">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电子面单打印风格" prop="printStyle">
          <el-input v-model="form.printStyle" placeholder="请输入电子面单打印风格" />
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
import { createExpressCompany, updateExpressCompany, deleteExpressCompany, getExpressCompany, getExpressCompanyPage, exportExpressCompanyExcel } from '@/api/system/expressCompany';
import ImageUpload from '@/components/ImageUpload';

export default {
  name: 'ExpressCompany',
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
      // 系统物流公司列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        logo: null,
        url: null,
        sort: null,
        kdBirdNo: null,
        kd100No: null,
        kd100NoFree: null,
        cainiaoNo: null,
        extNo: null,
        supportElectronicSheet: null,
        printStyle: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: '物流公司名称不能为空', trigger: 'blur' }],
        logo: [{ required: true, message: '物流公司logo不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '物流公司网址不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        kdBirdNo: [{ required: true, message: '编码（快递鸟）不能为空', trigger: 'blur' }],
        kd100No: [{ required: true, message: '编码（快递100）不能为空', trigger: 'blur' }],
        kd100NoFree: [{ required: true, message: '编码（快递100免费版）不能为空', trigger: 'blur' }],
        cainiaoNo: [{ required: true, message: '编码（菜鸟）不能为空', trigger: 'blur' }],
        extNo: [{ required: true, message: '编码（快递查询接口）不能为空', trigger: 'blur' }],
        supportElectronicSheet: [{ required: true, message: '是否支持电子面单（0不支持  1支持）不能为空', trigger: 'blur' }],
        printStyle: [{ required: true, message: '电子面单打印风格不能为空', trigger: 'blur' }],
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
      getExpressCompanyPage(this.queryParams).then(response => {
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
        name: undefined,
        logo: undefined,
        url: undefined,
        sort: undefined,
        kdBirdNo: undefined,
        kd100No: undefined,
        kd100NoFree: undefined,
        cainiaoNo: undefined,
        extNo: undefined,
        supportElectronicSheet: undefined,
        printStyle: undefined,
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
      this.title = '添加系统物流公司';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getExpressCompany(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改系统物流公司';
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
          updateExpressCompany(this.form).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createExpressCompany(this.form).then(response => {
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
        .confirm('是否确认删除系统物流公司编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteExpressCompany(id);
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
        .confirm('是否确认导出所有系统物流公司数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportExpressCompanyExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '系统物流公司.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
