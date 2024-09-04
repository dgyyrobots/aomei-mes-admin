<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="应用端口" prop="appModule">
        <el-input v-model="queryParams.appModule" placeholder="请输入应用端口" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="配置项" prop="configKey">
        <el-input v-model="queryParams.configKey" placeholder="请输入配置项" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否启用" prop="isUse">
        <el-select v-model="queryParams.isUse" placeholder="请选择是否启用 1启用 0不启用" clearable size="small">
          <el-option v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:config:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading" v-hasPermi="['system:config:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="应用端口关键字" align="center" prop="appModule" />
      <el-table-column label="配置项关键字" align="center" prop="configKey" />
      <el-table-column label="配置值json" align="center" prop="value" />
      <el-table-column label="描述" align="center" prop="configDesc" />
      <el-table-column label="是否启用" align="center" prop="isUse">
        <template v-slot="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isUse == 1 ? 'true' : 'false'" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:config:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:config:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="应用端口" prop="appModule">
          <el-input v-model="form.appModule" placeholder="请输入应用端口关键字" />
        </el-form-item>
        <el-form-item label="配置项" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入配置项关键字" />
        </el-form-item>
        <el-form-item label="配置值json" prop="value">
          <el-input v-model="form.value" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="描述" prop="configDesc">
          <el-input v-model="form.configDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isUse">
          <el-radio-group v-model="form.isUse">
            <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
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
import { createConfig, updateConfig, deleteConfig, getConfig, getConfigPage, exportConfigExcel } from '@/api/system/config';

export default {
  name: 'Config',
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
      // 参数配置列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        appModule: null,
        configKey: null,
        value: null,
        configDesc: null,
        isUse: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        appModule: [{ required: true, message: '应用端口关键字不能为空', trigger: 'blur' }],
        configKey: [{ required: true, message: '配置项关键字不能为空', trigger: 'blur' }],
        configDesc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        isUse: [{ required: true, message: '是否启用 1启用 0不启用不能为空', trigger: 'blur' }],
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
      getConfigPage(this.queryParams).then(response => {
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
        appModule: undefined,
        configKey: undefined,
        value: undefined,
        configDesc: undefined,
        isUse: undefined,
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
      this.title = '添加参数配置';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getConfig(id).then(response => {
        // 需要将值再转换回来
        response.data.isUse = response.data.isUse == 1 ? 'true' : 'false';
        this.form = response.data;
        this.open = true;
        this.title = '修改参数配置';
      });
    },
    /** 提交按钮 */
    submitForm() {
      // 此处提交传参需为数组
      // 将此数值转换为数字
      let forms = JSON.stringify(this.form);
      forms = JSON.parse(forms);
      forms.isUse = forms.isUse == 'true' ? 1 : 0;
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateConfig([forms]).then(response => {
            this.$modal.msgSuccess('修改成功');
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createConfig([forms]).then(response => {
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
        .confirm('是否确认删除参数配置编号为"' + id + '"的数据项?')
        .then(function () {
          return deleteConfig(id);
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
        .confirm('是否确认导出所有参数配置数据项?')
        .then(() => {
          this.exportLoading = true;
          return exportConfigExcel(params);
        })
        .then(response => {
          this.$download.excel(response, '参数配置.xls');
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
